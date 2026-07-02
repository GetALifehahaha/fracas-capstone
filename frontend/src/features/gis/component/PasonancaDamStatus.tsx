import { useState } from 'react'
import { Card } from '@/common/ui/card'
import { Progress, ProgressLabel } from '@/common/ui/progress'
import { Label } from '@/common/ui/label'
import { Badge } from '@/common/ui/badge'
import { Separator } from '@/common/ui/separator'
import type { DamStatus } from '../types/api'

interface Props {
    data: DamStatus | undefined
    isLoading: boolean
}

/** How close the level sits between normal and critical, as a 0–100%. */
const criticalRatio = (d: DamStatus): number | null => {
    if (d.current_level == null || d.normal_level == null || d.critical_level == null) return null
    const span = d.critical_level - d.normal_level
    if (span <= 0) return null
    return Math.max(0, Math.min(100, ((d.current_level - d.normal_level) / span) * 100))
}

const PasonancaDamStatus = ({ data, isLoading }: Props) => {
    const [isExpanded, setExpanded] = useState(false)

    if (isLoading || !data) {
        return (
            <Card className='col-span-2 px-4'>
                <h5 className='text-muted-foreground font-semibold'>PASONANCA DAM STATUS</h5>
                <p className='text-muted-foreground text-sm'>{isLoading ? 'Loading…' : 'Unavailable'}</p>
            </Card>
        )
    }

    if (!data.has_data) {
        return (
            <Card className='col-span-2 px-4'>
                <h5 className='text-muted-foreground font-semibold'>PASONANCA DAM STATUS</h5>
                <p className='text-muted-foreground text-sm'>No readings yet.</p>
            </Card>
        )
    }

    const ratio = criticalRatio(data)

    return (
        <Card className='col-span-2 cursor-pointer px-4' onClick={() => setExpanded((e) => !e)}>
            <div className='flex items-center justify-between'>
                <h5 className='text-muted-foreground font-semibold'>PASONANCA DAM STATUS</h5>
                {data.is_spilling && <Badge variant='destructive'>Spilling</Badge>}
            </div>
            <Progress value={ratio ?? 0}>
                <ProgressLabel className='font-bold'>
                    {ratio == null ? 'Level unavailable' : `${ratio.toFixed(0)}% toward critical`}
                </ProgressLabel>
            </Progress>

            {isExpanded && (
                <>
                    <Separator />
                    <div className='grid grid-cols-2 gap-3'>
                        <div className='flex flex-col gap-1'>
                            <Label>Current / Critical</Label>
                            <div className='flex items-end gap-1'>
                                <h4 className='text-xl font-semibold'>
                                    {data.current_level}/{data.critical_level}
                                </h4>
                                <h5 className='text-muted-foreground text-sm'>m</h5>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label>Rate of Change</Label>
                            <div className='flex items-end gap-1'>
                                <h4 className='text-xl font-semibold'>
                                    {data.rate_of_change ?? '—'}
                                </h4>
                                <h5 className='text-muted-foreground text-sm'>m/hr</h5>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Card>
    )
}

export default PasonancaDamStatus
