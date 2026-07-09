import { Card, CardContent, CardHeader, CardTitle } from '@/common/ui/card'
import { Badge } from '@/common/ui/badge'
import type { Probe, SystemStatus } from '../../types/system'
import { lastRunLabel } from '../utils'

const StatusDot = ({ ok }: { ok: boolean }) => (
    <span
        className={`inline-block size-2 rounded-full ${ok ? 'bg-emerald-500' : 'bg-destructive'}`}
        aria-hidden
    />
)

const ProbeRow = ({ label, probe }: { label: string; probe: Probe }) => (
    <div className='flex items-center justify-between text-sm'>
        <span className='text-muted-foreground'>{label}</span>
        <span className='flex items-center gap-2'>
            <StatusDot ok={probe.ok} />
            {probe.ok ? 'OK' : probe.detail || 'Down'}
        </span>
    </div>
)

/** Top-line health: overall status, DB/cache probes, and ingestion freshness. */
const HealthOverview = ({ status }: { status: SystemStatus }) => (
    <Card>
        <CardHeader className='flex-row items-center justify-between'>
            <CardTitle>Health</CardTitle>
            <Badge variant={status.healthy ? 'secondary' : 'destructive'}>
                {status.healthy ? 'Healthy' : 'Degraded'}
            </Badge>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
            <ProbeRow label='Database' probe={status.database} />
            <ProbeRow label='Cache' probe={status.cache} />
            {Object.entries(status.ingestion).map(([source, info]) => (
                <div key={source} className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground capitalize'>{source} ingest</span>
                    <span className='flex items-center gap-2'>
                        <StatusDot ok={info.fresh} />
                        {lastRunLabel(info.last_success_at)}
                    </span>
                </div>
            ))}
        </CardContent>
    </Card>
)

export default HealthOverview
