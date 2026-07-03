import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
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
import { Field, FieldDescription, FieldLabel } from '@/common/ui/field'
import { DateTimePicker } from '@/common/ui/datetime-picker'
import { useResolveFloodEvent } from '../hooks/useFloodEventActions'

const pad = (n: number) => String(n).padStart(2, '0')

/** `YYYY-MM-DDTHH:mm` local string for "now", the sensible resolve default. */
const nowLocal = (): string => {
    const d = new Date()
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface ResolveDialogProps {
    eventId: number
    /** ISO string — the resolve time must not precede this. */
    occurredAt: string
    trigger: React.ReactElement
}

/** Quick-resolve: pick an end time to close out an unresolved flood event. */
const ResolveDialog = ({ eventId, occurredAt, trigger }: ResolveDialogProps) => {
    const [open, setOpen] = useState(false)
    const [endedAt, setEndedAt] = useState(nowLocal)
    const resolve = useResolveFloodEvent()

    const onOpenChange = (next: boolean) => {
        setOpen(next)
        if (next) {
            setEndedAt(nowLocal())
            resolve.reset()
        }
    }

    const valid = endedAt !== '' && new Date(endedAt) >= new Date(occurredAt)

    const handleResolve = () => {
        if (!valid) return
        resolve.mutate(
            { id: eventId, endedAt: new Date(endedAt).toISOString() },
            { onSuccess: () => setOpen(false) },
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger render={trigger} />
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <CheckCircle2 className='size-4' />
                        Resolve flood event
                    </DialogTitle>
                    <DialogDescription>
                        Record when floodwater receded to close out this event.
                    </DialogDescription>
                </DialogHeader>

                <Field>
                    <FieldLabel htmlFor='resolve-ended'>Ended at</FieldLabel>
                    <DateTimePicker id='resolve-ended' value={endedAt} onChange={setEndedAt} />
                    {!valid && endedAt !== '' && (
                        <FieldDescription className='text-destructive'>
                            Must be at or after the event started.
                        </FieldDescription>
                    )}
                    {resolve.isError && (
                        <FieldDescription className='text-destructive'>
                            Couldn&apos;t resolve. Please try again.
                        </FieldDescription>
                    )}
                </Field>

                <DialogFooter>
                    <DialogClose render={<Button type='button' variant='outline'>Cancel</Button>} />
                    <Button
                        type='button'
                        className='cursor-pointer'
                        disabled={!valid || resolve.isPending}
                        onClick={handleResolve}
                    >
                        {resolve.isPending ? 'Resolving…' : 'Resolve'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ResolveDialog
