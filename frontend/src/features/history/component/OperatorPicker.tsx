import { useMemo, useState } from 'react'
import { Check, Search, UserRound } from 'lucide-react'
import { Button } from '@/common/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/common/ui/dialog'
import { Input } from '@/common/ui/input'
import { cn } from '@/common/utils/utils'
import ErrorState from '@/common/components/ErrorState'
import { useOperators } from '../hooks/useOperators'
import type { Operator } from '../types/api'

interface OperatorPickerProps {
    value: number | null
    /** Display name for the current value (survives even before the list loads). */
    valueName?: string | null
    onChange: (operator: Operator) => void
}

/** Modal operator selector with in-memory search (the list is small + unpaginated). */
const OperatorPicker = ({ value, valueName, onChange }: OperatorPickerProps) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const { data: operators, isLoading, isError, refetch } = useOperators(open)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        const list = operators ?? []
        return q ? list.filter((o) => o.name.toLowerCase().includes(q)) : list
    }, [operators, query])

    const onOpenChange = (next: boolean) => {
        setOpen(next)
        if (next) setQuery('')
    }

    const pick = (operator: Operator) => {
        onChange(operator)
        setOpen(false)
    }

    const label = value != null ? (valueName ?? `Operator #${value}`) : 'Select operator'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger
                render={
                    <Button
                        type='button'
                        variant='outline'
                        className={cn(
                            'w-full justify-start font-normal',
                            value == null && 'text-muted-foreground',
                        )}
                    >
                        <UserRound className='size-4' />
                        {label}
                    </Button>
                }
            />
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Select reporting operator</DialogTitle>
                    <DialogDescription>Search by name.</DialogDescription>
                </DialogHeader>

                <div className='relative'>
                    <Search className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        autoFocus
                        placeholder='Search operators…'
                        className='pl-8'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className='flex max-h-[50vh] flex-col gap-0.5 overflow-y-auto'>
                    {isLoading && <p className='p-2 text-sm text-black/50'>Loading…</p>}
                    {isError && (
                        <ErrorState
                            variant='inline'
                            title='Couldn’t load operators'
                            message='The operator list didn’t load. Try again in a moment.'
                            onRetry={() => refetch()}
                        />
                    )}
                    {!isLoading && !isError && filtered.length === 0 && (
                        <p className='p-2 text-sm text-black/50'>No operators match.</p>
                    )}
                    {filtered.map((operator) => (
                        <button
                            key={operator.id}
                            type='button'
                            onClick={() => pick(operator)}
                            className='hover:bg-muted flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors'
                        >
                            {operator.name}
                            {operator.id === value && <Check className='size-4 text-primary' />}
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OperatorPicker
