import { format } from 'date-fns'
import { Radar } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/common/ui/card'
import { Label } from '@/common/ui/label'
import { Separator } from '@/common/ui/separator'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/ui/select'
import { cn } from '@/common/utils/utils'
import {
    useAutoDetectConfig,
    useUpdateAutoDetectConfig,
} from '../hooks/useAutoDetectConfig'
import { THRESHOLD_OPTIONS } from '../constants/floodEvents'
import type { RiskThreshold } from '../types/api'

/** A compact on/off toggle (no Switch primitive in the kit). */
const Toggle = ({
    checked,
    disabled,
    onChange,
}: {
    checked: boolean
    disabled?: boolean
    onChange: (next: boolean) => void
}) => (
    <button
        type='button'
        role='switch'
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50',
            checked ? 'bg-primary' : 'bg-muted-foreground/30',
        )}
    >
        <span
            className={cn(
                'inline-block size-4 rounded-full bg-white shadow transition-transform',
                checked ? 'translate-x-6' : 'translate-x-1',
            )}
        />
    </button>
)

/**
 * Standalone admin console (separate from Django /admin) for the auto-detection
 * rule: whether the scoring pipeline drafts unconfirmed flood events and the
 * risk threshold that triggers one.
 */
const AutoDetectAdmin = () => {
    const { data: config, isLoading, isError } = useAutoDetectConfig()
    const update = useUpdateAutoDetectConfig()

    return (
        <div className='mx-auto w-full max-w-2xl p-4'>
            <div className='flex items-center gap-2'>
                <Radar className='size-6' />
                <div>
                    <h1 className='text-2xl font-semibold'>Auto-detection</h1>
                    <p className='text-xs text-black/50'>
                        Control when the system drafts flood events for LGU confirmation.
                    </p>
                </div>
            </div>

            <Card className='my-4'>
                {isLoading && <p className='text-sm text-black/50'>Loading…</p>}
                {isError && (
                    <p className='text-sm text-destructive'>Couldn&apos;t load the configuration.</p>
                )}
                {config && (
                    <>
                        <div className='flex items-center justify-between'>
                            <div>
                                <CardTitle>Enable auto-detection</CardTitle>
                                <p className='text-xs text-black/50'>
                                    When on, each scoring cycle drafts an unconfirmed event for any
                                    barangay at or above the threshold.
                                </p>
                            </div>
                            <Toggle
                                checked={config.enabled}
                                disabled={update.isPending}
                                onChange={(enabled) => update.mutate({ enabled })}
                            />
                        </div>

                        <Separator />

                        <CardContent className='flex items-center justify-between px-0'>
                            <div>
                                <Label className='font-medium'>Risk threshold</Label>
                                <p className='text-xs text-black/50'>
                                    Minimum risk category that triggers a draft.
                                </p>
                            </div>
                            <Select
                                value={config.threshold_category}
                                onValueChange={(v) =>
                                    update.mutate({ threshold_category: v as RiskThreshold })
                                }
                            >
                                <SelectTrigger className='w-40'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {THRESHOLD_OPTIONS.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>

                        <Separator />

                        <div className='flex items-center justify-between text-xs text-black/50'>
                            <span>
                                {update.isPending
                                    ? 'Saving…'
                                    : update.isError
                                        ? 'Couldn’t save — try again.'
                                        : 'Changes save automatically.'}
                            </span>
                            <span>
                                Updated {format(new Date(config.updated_at), 'LLL d, y · HH:mm')}
                            </span>
                        </div>
                    </>
                )}
            </Card>
        </div>
    )
}

export default AutoDetectAdmin
