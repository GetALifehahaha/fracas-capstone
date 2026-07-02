import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/ui/card'
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/common/ui/field'
import { Input } from '@/common/ui/input'
import { Textarea } from '@/common/ui/textarea'
import { Button } from '@/common/ui/button'
import { cn } from '@/common/utils/utils'
import { useBarangays } from '@/features/gis/hooks/useBarangays'
import { useBroadcast } from '../hooks/useBroadcast'

/** Operator broadcast console: push a manual advisory to a barangay's subscribers. */
const BroadcastForm = () => {
    const { data: collection, isLoading: loadingBarangays } = useBarangays()
    const broadcast = useBroadcast()

    const [barangay, setBarangay] = useState('')
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')

    const options = useMemo(
        () =>
            (collection?.features ?? [])
                .map((f) => ({ id: f.properties.id, name: f.properties.name }))
                .sort((a, b) => a.name.localeCompare(b.name)),
        [collection],
    )

    const canSend = barangay !== '' && message.trim().length > 0 && !broadcast.isPending

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!canSend) return
        broadcast.mutate(
            { barangay: Number(barangay), title: title.trim() || undefined, message: message.trim() },
            {
                onSuccess: () => {
                    setTitle('')
                    setMessage('')
                },
            },
        )
    }

    const selectClasses =
        'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50'

    return (
        <Card className='h-fit'>
            <CardHeader>
                <CardTitle>Broadcast advisory</CardTitle>
                <CardDescription>
                    Send a manual alert to a barangay&apos;s subscribers across every channel
                    they&apos;ve opted into. Recorded in the alert log.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='broadcast-barangay'>Target barangay</FieldLabel>
                            <select
                                id='broadcast-barangay'
                                className={selectClasses}
                                value={barangay}
                                disabled={loadingBarangays}
                                onChange={(e) => setBarangay(e.target.value)}
                            >
                                <option value='' disabled>
                                    {loadingBarangays ? 'Loading…' : 'Select a barangay'}
                                </option>
                                {options.map((o) => (
                                    <option key={o.id} value={o.id}>
                                        {o.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor='broadcast-title'>
                                Title <span className='text-muted-foreground'>(optional)</span>
                            </FieldLabel>
                            <Input
                                id='broadcast-title'
                                value={title}
                                maxLength={150}
                                placeholder='Advisory'
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor='broadcast-message'>Message</FieldLabel>
                            <Textarea
                                id='broadcast-message'
                                value={message}
                                rows={4}
                                placeholder='e.g. Tumaga river rising fast — move to higher ground now.'
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Field>

                        <div className='flex items-center gap-3'>
                            <Button type='submit' disabled={!canSend} className='cursor-pointer'>
                                {broadcast.isPending ? 'Sending…' : 'Send broadcast'}
                            </Button>
                            {broadcast.isSuccess && (
                                <FieldDescription className='text-emerald-600'>
                                    Sent to {broadcast.data.recipients}{' '}
                                    {broadcast.data.recipients === 1 ? 'subscriber' : 'subscribers'}.
                                </FieldDescription>
                            )}
                            {broadcast.isError && (
                                <FieldDescription className={cn('text-destructive')}>
                                    Failed to send. Try again.
                                </FieldDescription>
                            )}
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

export default BroadcastForm
