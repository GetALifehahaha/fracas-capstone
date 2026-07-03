import { useState } from 'react'
import { format } from 'date-fns'
import { ArrowRight, History } from 'lucide-react'
import { Button } from '@/common/ui/button'
import { Badge } from '@/common/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/common/ui/dialog'
import { useFloodEventChanges } from '../hooks/useFloodEventChanges'
import { CHANGE_ACTION_LABELS, CHANGE_FIELD_LABELS } from '../constants/floodEvents'
import type { FloodEventChange } from '../types/api'

/** A change-log entry as a from → to row, echoing the response-timeline look. */
const ChangeRow = ({ change }: { change: FloodEventChange }) => {
    const when = new Date(change.changed_at)
    const isEdit = change.action === 'updated'
    const fieldLabel = CHANGE_FIELD_LABELS[change.field] ?? change.field

    return (
        <div className='border-l-2 border-border pl-3'>
            <div className='flex items-center justify-between gap-2'>
                <span className='flex items-center gap-2 text-sm font-medium'>
                    <Badge variant='secondary' className='font-normal'>
                        {CHANGE_ACTION_LABELS[change.action] ?? change.action}
                    </Badge>
                    {isEdit && fieldLabel}
                </span>
                <span className='text-xs text-black/50' title={when.toLocaleString()}>
                    {format(when, 'LLL d, y · HH:mm')}
                </span>
            </div>

            {isEdit && (
                <div className='mt-1 flex flex-wrap items-center gap-1.5 text-xs'>
                    <span className='rounded bg-muted px-1.5 py-0.5 text-black/60 line-through'>
                        {change.old_value || '—'}
                    </span>
                    <ArrowRight className='size-3 text-black/40' />
                    <span className='rounded bg-muted px-1.5 py-0.5 font-medium'>
                        {change.new_value || '—'}
                    </span>
                </div>
            )}

            <p className='mt-0.5 text-xs text-black/50'>by {change.editor_name ?? 'System'}</p>
        </div>
    )
}

interface ChangeHistoryModalProps {
    eventId: number
}

/** Scrollable audit-trail modal for one flood event. Fetches lazily on open. */
const ChangeHistoryModal = ({ eventId }: ChangeHistoryModalProps) => {
    const [open, setOpen] = useState(false)
    const { data: changes, isLoading, isError } = useFloodEventChanges(eventId, open)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button size='sm' variant='outline' className='cursor-pointer'>
                        <History className='size-4' />
                        Change log
                    </Button>
                }
            />
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Change log</DialogTitle>
                    <DialogDescription>
                        Every edit to this flood event, most recent first.
                    </DialogDescription>
                </DialogHeader>

                <div className='flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1'>
                    {isLoading && <p className='text-sm text-black/50'>Loading…</p>}
                    {isError && (
                        <p className='text-sm text-destructive'>Couldn&apos;t load the change log.</p>
                    )}
                    {changes?.length === 0 && (
                        <p className='text-sm text-black/50'>No changes recorded yet.</p>
                    )}
                    {changes?.map((change) => <ChangeRow key={change.id} change={change} />)}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ChangeHistoryModal
