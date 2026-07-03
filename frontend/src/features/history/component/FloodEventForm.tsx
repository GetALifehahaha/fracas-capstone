import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/common/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/common/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/common/ui/field'
import { Input } from '@/common/ui/input'
import { Textarea } from '@/common/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/ui/select'
import { useBarangays } from '@/features/gis/hooks/useBarangays'
import { useSaveFloodEvent } from '../hooks/useSaveFloodEvent'
import { SEVERITY_FILTERS, SEVERITY_LABELS } from '../constants/floodEvents'
import type { FloodEventDetail, FloodEventInput, FloodSeverity } from '../types/api'

interface FloodEventFormProps {
    /** Provided → edit mode; omitted → create mode. */
    event?: FloodEventDetail
    trigger: React.ReactElement
}

interface TimelineRow {
    occurred_at: string
    title: string
    description: string
}

/** ISO string → `YYYY-MM-DDTHH:mm` in local time for a datetime-local input. */
const toLocalInput = (iso: string | null | undefined): string => {
    if (!iso) return ''
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const toIso = (local: string): string | null => (local ? new Date(local).toISOString() : null)

const blankForm = {
    barangay: '',
    occurredAt: '',
    endedAt: '',
    severity: 'moderate' as FloodSeverity,
    waterDepth: '',
    summary: '',
    peopleAffected: '',
    peopleEvacuated: '',
    source: '',
    notes: '',
}

const formFromEvent = (e: FloodEventDetail): typeof blankForm => ({
    barangay: String(e.barangay),
    occurredAt: toLocalInput(e.occurred_at),
    endedAt: toLocalInput(e.ended_at),
    severity: e.severity,
    waterDepth: e.water_depth_m?.toString() ?? '',
    summary: e.summary,
    peopleAffected: e.people_affected?.toString() ?? '',
    peopleEvacuated: e.people_evacuated?.toString() ?? '',
    source: e.source,
    notes: e.notes,
})

const numOrNull = (s: string): number | null => (s.trim() === '' ? null : Number(s))

/** Operator create/edit form for a flood event, with an inline response timeline. */
const FloodEventForm = ({ event, trigger }: FloodEventFormProps) => {
    const save = useSaveFloodEvent()
    const { data: collection } = useBarangays()
    const [open, setOpen] = useState(false)

    const initial = () => (event ? formFromEvent(event) : blankForm)
    const initialTimeline = (): TimelineRow[] =>
        event?.timeline.map((t) => ({
            occurred_at: toLocalInput(t.occurred_at),
            title: t.title,
            description: t.description,
        })) ?? []

    const [form, setForm] = useState(initial)
    const [timeline, setTimeline] = useState<TimelineRow[]>(initialTimeline)

    const barangayOptions = useMemo(
        () =>
            (collection?.features ?? [])
                .map((f) => ({ id: f.properties.id, name: f.properties.name }))
                .sort((a, b) => a.name.localeCompare(b.name)),
        [collection],
    )
    const selectedName = barangayOptions.find((o) => String(o.id) === form.barangay)?.name

    // Reset to the initial values every time the modal opens fresh.
    const onOpenChange = (next: boolean) => {
        setOpen(next)
        if (next) {
            setForm(initial())
            setTimeline(initialTimeline())
            save.reset()
        }
    }

    const set = (key: keyof typeof blankForm) => (value: string) =>
        setForm((f) => ({ ...f, [key]: value }))

    const setRow = (i: number, key: keyof TimelineRow, value: string) =>
        setTimeline((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)))
    const addRow = () =>
        setTimeline((rows) => [...rows, { occurred_at: form.occurredAt, title: '', description: '' }])
    const removeRow = (i: number) => setTimeline((rows) => rows.filter((_, idx) => idx !== i))

    const datesValid =
        !form.endedAt || !form.occurredAt || new Date(form.endedAt) >= new Date(form.occurredAt)
    const canSave =
        form.barangay !== '' && form.occurredAt !== '' && datesValid && !save.isPending

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!canSave) return
        const payload: FloodEventInput = {
            barangay: Number(form.barangay),
            occurred_at: toIso(form.occurredAt) as string,
            ended_at: toIso(form.endedAt),
            severity: form.severity,
            water_depth_m: numOrNull(form.waterDepth),
            summary: form.summary.trim(),
            people_affected: numOrNull(form.peopleAffected),
            people_evacuated: numOrNull(form.peopleEvacuated),
            source: form.source.trim(),
            notes: form.notes.trim(),
            timeline: timeline
                .filter((r) => r.title.trim() && r.occurred_at)
                .map((r) => ({
                    occurred_at: toIso(r.occurred_at) as string,
                    title: r.title.trim(),
                    description: r.description.trim() || undefined,
                })),
        }
        save.mutate({ id: event?.id, payload }, { onSuccess: () => setOpen(false) })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger render={trigger} />
            <DialogContent className='max-w-2xl max-h-[85vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{event ? 'Edit flood event' : 'New flood event'}</DialogTitle>
                    <DialogDescription>
                        Recorded flood events power the history page and validate the risk model.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <FieldGroup className='gap-3'>
                        <div className='grid grid-cols-2 gap-3'>
                            <Field>
                                <FieldLabel htmlFor='fe-barangay'>Barangay</FieldLabel>
                                <Select
                                    id='fe-barangay'
                                    value={form.barangay}
                                    onValueChange={(v) => set('barangay')(String(v))}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select a barangay'>
                                            {selectedName}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className='max-h-72' alignItemWithTrigger={true}>
                                        {barangayOptions.map((o) => (
                                            <SelectItem key={o.id} value={String(o.id)}>
                                                {o.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='fe-severity'>Severity</FieldLabel>
                                <Select
                                    id='fe-severity'
                                    value={form.severity}
                                    onValueChange={(v) => set('severity')(String(v))}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue>
                                            {(v) => SEVERITY_LABELS[v as FloodSeverity]}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEVERITY_FILTERS.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>
                                                {s.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='fe-occurred'>Occurred at</FieldLabel>
                                <Input
                                    id='fe-occurred'
                                    type='datetime-local'
                                    value={form.occurredAt}
                                    onChange={(e) => set('occurredAt')(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='fe-ended'>
                                    Ended at <span className='text-black/40'>(optional)</span>
                                </FieldLabel>
                                <Input
                                    id='fe-ended'
                                    type='datetime-local'
                                    value={form.endedAt}
                                    onChange={(e) => set('endedAt')(e.target.value)}
                                />
                                {!datesValid && (
                                    <FieldDescription className='text-destructive'>
                                        Must be at or after the start time.
                                    </FieldDescription>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='fe-depth'>
                                    Water depth (m) <span className='text-black/40'>(optional)</span>
                                </FieldLabel>
                                <Input
                                    id='fe-depth'
                                    type='number'
                                    step='0.1'
                                    min='0'
                                    value={form.waterDepth}
                                    onChange={(e) => set('waterDepth')(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='fe-source'>
                                    Source <span className='text-black/40'>(optional)</span>
                                </FieldLabel>
                                <Input
                                    id='fe-source'
                                    value={form.source}
                                    maxLength={255}
                                    placeholder='DRRMO report, news, PAGASA…'
                                    onChange={(e) => set('source')(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='fe-affected'>
                                    People affected <span className='text-black/40'>(optional)</span>
                                </FieldLabel>
                                <Input
                                    id='fe-affected'
                                    type='number'
                                    min='0'
                                    value={form.peopleAffected}
                                    onChange={(e) => set('peopleAffected')(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='fe-evacuated'>
                                    People evacuated <span className='text-black/40'>(optional)</span>
                                </FieldLabel>
                                <Input
                                    id='fe-evacuated'
                                    type='number'
                                    min='0'
                                    value={form.peopleEvacuated}
                                    onChange={(e) => set('peopleEvacuated')(e.target.value)}
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel htmlFor='fe-summary'>
                                Summary <span className='text-black/40'>(optional)</span>
                            </FieldLabel>
                            <Textarea
                                id='fe-summary'
                                rows={3}
                                value={form.summary}
                                placeholder='Narrative account of the event.'
                                onChange={(e) => set('summary')(e.target.value)}
                            />
                        </Field>

                        <Field>
                            <div className='flex items-center justify-between'>
                                <FieldLabel>Response timeline</FieldLabel>
                                <Button
                                    type='button'
                                    size='xs'
                                    variant='outline'
                                    className='cursor-pointer'
                                    onClick={addRow}
                                >
                                    <Plus className='size-3' />
                                    Add step
                                </Button>
                            </div>
                            {timeline.length === 0 && (
                                <FieldDescription>No timeline steps yet.</FieldDescription>
                            )}
                            <div className='flex flex-col gap-2'>
                                {timeline.map((row, i) => (
                                    <div key={i} className='flex items-start gap-2'>
                                        <Input
                                            type='datetime-local'
                                            className='w-52'
                                            value={row.occurred_at}
                                            onChange={(e) => setRow(i, 'occurred_at', e.target.value)}
                                        />
                                        <div className='flex flex-1 flex-col gap-1'>
                                            <Input
                                                placeholder='Title (e.g. Alert triggered)'
                                                value={row.title}
                                                onChange={(e) => setRow(i, 'title', e.target.value)}
                                            />
                                            <Input
                                                placeholder='Detail (optional)'
                                                value={row.description}
                                                onChange={(e) => setRow(i, 'description', e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            type='button'
                                            size='icon'
                                            variant='ghost'
                                            className='cursor-pointer text-black/50'
                                            onClick={() => removeRow(i)}
                                        >
                                            <Trash2 className='size-4' />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Field>

                        {save.isError && (
                            <FieldDescription className='text-destructive'>
                                Couldn&apos;t save. Check the required fields and dates, then try again.
                            </FieldDescription>
                        )}

                        <DialogFooter>
                            <DialogClose
                                render={<Button type='button' variant='outline'>Cancel</Button>}
                            />
                            <Button type='submit' disabled={!canSave} className='cursor-pointer'>
                                {save.isPending ? 'Saving…' : event ? 'Save changes' : 'Create event'}
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FloodEventForm
