import { useCallback, useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { AlertTriangle } from 'lucide-react'
import { Card } from '@/common/ui/card'
import ErrorState from '@/common/components/ErrorState'
import GISMap from './component/GISMap'
import RiskCard from './component/RiskCard'
import Legend from './component/Legend'
import PasonancaDamStatus from './component/PasonancaDamStatus'
import BarangayPanel from './component/BarangayPanel'
import { useRiskMap } from './hooks/useRiskMap'
import { useDamStatus } from './hooks/useDamStatus'

/** Live viewport width, so panel padding stays correct across resizes. */
const useViewportWidth = (): number => {
    const [width, setWidth] = useState(() => window.innerWidth)
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])
    return width
}

const FreshnessBar = ({
    computedAt,
    degradedCount,
}: {
    computedAt: string | null
    degradedCount: number
}) => (
    <Card size='sm' className='col-span-2 flex-row items-center justify-between px-3 py-2'>
        <span className='text-muted-foreground text-xs'>
            {computedAt
                ? `Updated ${formatDistanceToNow(new Date(computedAt), { addSuffix: true })}`
                : 'Awaiting first computation'}
        </span>
        {degradedCount > 0 && (
            <span className='text-destructive flex items-center gap-1 text-xs font-medium'>
                <AlertTriangle className='size-3.5' />
                {degradedCount} degraded
            </span>
        )}
    </Card>
)

const Dashboard = () => {
    const { features, groups, computedAt, degradedCount, isLoading, isError, refetch } = useRiskMap()
    const dam = useDamStatus()
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const viewportWidth = useViewportWidth()
    const panelWidth = selectedId != null ? Math.round(viewportWidth * 0.25) : 0

    const handleSelect = useCallback((id: number | null) => setSelectedId(id), [])

    return (
        <>
            <Legend />

            {selectedId == null && (
                <div className='absolute top-4 right-4 z-2 grid w-1/4 grid-cols-2 gap-2'>
                    {isError ? (
                        <ErrorState
                            variant='inline'
                            className='col-span-2'
                            title='Risk data unavailable'
                            message='We couldn’t load the latest barangay risk scores. The map may be out of date until this recovers.'
                            onRetry={() => refetch()}
                        />
                    ) : (
                        <>
                            <FreshnessBar computedAt={computedAt} degradedCount={degradedCount} />
                            {groups.map((group) => (
                                <RiskCard key={group.category} group={group} onSelect={handleSelect} />
                            ))}
                            <PasonancaDamStatus data={dam.data} isLoading={dam.isLoading} />
                        </>
                    )}
                </div>
            )}

            {isLoading && (
                <Card
                    size='sm'
                    className='absolute bottom-4 left-1/2 z-2 -translate-x-1/2 px-3 py-2'
                >
                    <span className='text-muted-foreground text-xs'>Loading risk data…</span>
                </Card>
            )}

            <GISMap
                data={features}
                selectedId={selectedId}
                onSelect={handleSelect}
                panelWidth={panelWidth}
            />

            {selectedId != null && (
                <BarangayPanel barangayId={selectedId} onClose={() => setSelectedId(null)} />
            )}
        </>
    )
}

export default Dashboard
