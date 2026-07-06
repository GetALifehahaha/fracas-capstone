import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/common/ui/button'
import { Input } from '@/common/ui/input'
import { Label } from '@/common/ui/label'
import { Textarea } from '@/common/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/ui/select'
import type { HotspotSeverity } from './types'

export interface HotspotFormValues {
    name: string
    severity: HotspotSeverity
    radius_m: string
    description: string
    is_active: boolean
}

const SEVERITIES: { value: HotspotSeverity; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
]

interface Props {
    initial: HotspotFormValues
    saving: boolean
    onSubmit: (values: HotspotFormValues) => void
    onCancel: () => void
    onDelete?: () => void
}

/** Compact flood-hotspot form rendered inside a map popup. */
const HotspotPopupForm = ({ initial, saving, onSubmit, onCancel, onDelete }: Props) => {
    const [values, setValues] = useState<HotspotFormValues>(initial)
    const set = (patch: Partial<HotspotFormValues>) => setValues((v) => ({ ...v, ...patch }))

    return (
        <form
            className='flex w-60 flex-col gap-2'
            onSubmit={(e) => {
                e.preventDefault()
                if (values.name.trim()) onSubmit(values)
            }}
        >
            <div className='flex flex-col gap-1'>
                <Label className='text-xs'>Name</Label>
                <Input
                    autoFocus
                    value={values.name}
                    onChange={(e) => set({ name: e.target.value })}
                    placeholder='e.g. Tumaga River Bend'
                    className='h-8'
                    required
                />
            </div>
            <div className='flex gap-2'>
                <div className='flex flex-1 flex-col gap-1'>
                    <Label className='text-xs'>Severity</Label>
                    <Select value={values.severity} onValueChange={(v) => set({ severity: v as HotspotSeverity })}>
                        <SelectTrigger className='h-8'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SEVERITIES.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-1 flex-col gap-1'>
                    <Label className='text-xs'>Radius (m)</Label>
                    <Input
                        type='number'
                        min={50}
                        step={50}
                        value={values.radius_m}
                        onChange={(e) => set({ radius_m: e.target.value })}
                        className='h-8'
                    />
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <Label className='text-xs'>Why it floods</Label>
                <Textarea
                    value={values.description}
                    onChange={(e) => set({ description: e.target.value })}
                    rows={2}
                    className='text-sm'
                />
            </div>
            <button
                type='button'
                onClick={() => set({ is_active: !values.is_active })}
                className='flex items-center justify-between rounded-md border px-2 py-1.5 text-xs'
            >
                <span>Status</span>
                <span className={values.is_active ? 'font-medium text-emerald-600' : 'text-muted-foreground'}>
                    {values.is_active ? 'Active' : 'Inactive'}
                </span>
            </button>
            <div className='flex items-center gap-2'>
                <Button type='submit' size='sm' className='flex-1' disabled={saving || !values.name.trim()}>
                    {saving ? 'Saving…' : 'Save'}
                </Button>
                <Button type='button' size='sm' variant='ghost' onClick={onCancel}>
                    Cancel
                </Button>
                {onDelete && (
                    <Button type='button' size='sm' variant='ghost' onClick={onDelete} aria-label='Delete'>
                        <Trash2 className='size-4 text-destructive' />
                    </Button>
                )}
            </div>
        </form>
    )
}

export default HotspotPopupForm
