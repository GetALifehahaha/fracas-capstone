import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/ui/select'
import { Skeleton } from '@/common/ui/skeleton'
import ErrorState from '@/common/components/ErrorState'
import capitalize from '@/common/utils/capitalize'
import { useAutoDetectConfig, useUpdateAutoDetect } from '../../hooks/useSystem'
import type { AutoDetectConfig } from '../../types/system'
import { SaveBar, SettingRow, ToggleField } from '../../settings/components/fields'

const AutoDetectForm = ({ initial }: { initial: AutoDetectConfig }) => {
    const [form, setForm] = useState(initial)
    const update = useUpdateAutoDetect()
    const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial])

    return (
        <div className='flex flex-col gap-5'>
            <ToggleField
                id='auto_detect_enabled'
                label='Auto-draft flood events'
                description='Let the pipeline draft flood events when a barangay crosses the threshold.'
                checked={form.enabled}
                onChange={(enabled) => setForm((f) => ({ ...f, enabled }))}
            />
            <SettingRow
                label='Threshold category'
                description='Minimum risk category that triggers an auto-drafted flood event.'
                htmlFor='auto_detect_threshold'
                control={
                    <Select
                        value={form.threshold_category}
                        onValueChange={(v) =>
                            setForm((f) => ({ ...f, threshold_category: v as AutoDetectConfig['threshold_category'] }))
                        }
                    >
                        <SelectTrigger id='auto_detect_threshold' className='w-36'>
                            <SelectValue>{(v) => capitalize(v as string)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='medium'>Medium</SelectItem>
                            <SelectItem value='high'>High</SelectItem>
                            <SelectItem value='critical'>Critical</SelectItem>
                        </SelectContent>
                    </Select>
                }
            />
            <SaveBar dirty={dirty} saving={update.isPending} onSave={() => update.mutate(form)} />
        </div>
    )
}

/** Auto-detection config for flood-event drafting (its own singleton endpoint). */
const AutoDetectCard = () => {
    const { data, isLoading, isError, refetch } = useAutoDetectConfig()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Auto-detection</CardTitle>
                <CardDescription>
                    Whether the pipeline auto-drafts flood events, and at what risk.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && <Skeleton className='h-20 w-full' />}
                {isError && (
                    <ErrorState
                        variant='inline'
                        message="Couldn't load auto-detect settings."
                        onRetry={() => refetch()}
                    />
                )}
                {data && <AutoDetectForm initial={data} />}
            </CardContent>
        </Card>
    )
}

export default AutoDetectCard
