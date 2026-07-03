import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/common/utils/utils'
import { Button } from '@/common/ui/button'
import { Calendar } from '@/common/ui/calendar'
import { Input } from '@/common/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/ui/popover'

/**
 * A datetime picker pairing a shadcn popover + calendar (date) with a native
 * time input (time-of-day). The value is the `YYYY-MM-DDTHH:mm` local string
 * used by the surrounding forms — the same shape a `datetime-local` input emits,
 * so callers stay unchanged.
 */
interface DateTimePickerProps {
    id?: string
    value: string
    onChange: (value: string) => void
    /** Placeholder date used for the time portion when only a date is picked. */
    className?: string
}

const pad = (n: number) => String(n).padStart(2, '0')

/** `YYYY-MM-DDTHH:mm` → { date: Date | undefined, time: 'HH:mm' }. */
const parse = (value: string): { date: Date | undefined; time: string } => {
    if (!value) return { date: undefined, time: '' }
    const [datePart, timePart = ''] = value.split('T')
    const [y, m, d] = datePart.split('-').map(Number)
    const date = y && m && d ? new Date(y, m - 1, d) : undefined
    return { date, time: timePart.slice(0, 5) }
}

/** Rebuild the `YYYY-MM-DDTHH:mm` string from a date + a `HH:mm` time. */
const combine = (date: Date | undefined, time: string): string => {
    if (!date) return ''
    const datePart = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    return `${datePart}T${time || '00:00'}`
}

function DateTimePicker({ id, value, onChange, className }: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false)
    const { date, time } = parse(value)

    const handleDate = (next: Date | undefined) => {
        onChange(combine(next, time || '00:00'))
        setOpen(false)
    }
    const handleTime = (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(combine(date ?? new Date(), e.target.value))

    return (
        <div className={cn('flex gap-2', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    render={
                        <Button
                            id={id}
                            type='button'
                            variant='outline'
                            className={cn(
                                'flex-1 justify-start text-left font-normal',
                                !date && 'text-muted-foreground',
                            )}
                        >
                            <CalendarIcon className='size-4' />
                            {date ? format(date, 'LLL dd, y') : 'Pick a date'}
                        </Button>
                    }
                />
                <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar mode='single' selected={date} onSelect={handleDate} autoFocus />
                </PopoverContent>
            </Popover>
            <Input
                type='time'
                aria-label='Time'
                className='w-28'
                value={time}
                onChange={handleTime}
            />
        </div>
    )
}

export { DateTimePicker }
