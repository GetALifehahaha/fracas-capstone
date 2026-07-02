import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/common/ui/table'
import { Badge } from '@/common/ui/badge'
import { Button } from '@/common/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/common/ui/card'
import { RISK_COLORS, CATEGORY_LABELS } from '@/features/gis/constants/risk'
import { useAlertEvents } from '../hooks/useAlertEvents'
import { KIND_LABELS, KIND_FILTERS } from '../constants/alerts'
import type { AlertEvent, AlertEventKind, AlertEventSource } from '../types/api'

const PAGE_SIZE = 25

const selectClasses =
    'h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

const LevelCell = ({ level }: { level: AlertEvent['level'] }) => (
    <span className='flex items-center gap-2'>
        <span
            className='aspect-square w-2 rounded-full ring-1 ring-foreground/10'
            style={{ backgroundColor: RISK_COLORS[level] }}
        />
        {CATEGORY_LABELS[level]}
    </span>
)

const AlertLogTable = () => {
    const [kind, setKind] = useState<AlertEventKind | ''>('')
    const [source, setSource] = useState<AlertEventSource | ''>('')
    const [page, setPage] = useState(1)

    const filters = {
        page,
        ...(kind && { kind }),
        ...(source && { source }),
    }
    const { data, isLoading, isError, isFetching } = useAlertEvents(filters)

    const events = data?.results ?? []
    const totalPages = data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1

    // Reset to page 1 whenever a filter changes so we never land on an empty page.
    const onFilter =
        <T,>(setter: (v: T) => void) =>
        (value: T) => {
            setter(value)
            setPage(1)
        }

    return (
        <Card className='flex flex-col'>
            <CardHeader className='flex-row items-center justify-between gap-4'>
                <CardTitle>Alert log</CardTitle>
                <div className='flex items-center gap-2'>
                    <select
                        aria-label='Filter by event'
                        className={selectClasses}
                        value={kind}
                        onChange={(e) => onFilter(setKind)(e.target.value as AlertEventKind | '')}
                    >
                        <option value=''>All events</option>
                        {KIND_FILTERS.map((k) => (
                            <option key={k.value} value={k.value}>
                                {k.label}
                            </option>
                        ))}
                    </select>
                    <select
                        aria-label='Filter by source'
                        className={selectClasses}
                        value={source}
                        onChange={(e) =>
                            onFilter(setSource)(e.target.value as AlertEventSource | '')
                        }
                    >
                        <option value=''>All sources</option>
                        <option value='automated'>Automated</option>
                        <option value='operator'>Operator</option>
                    </select>
                </div>
            </CardHeader>

            <CardContent className='flex-1'>
                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Barangay</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead className='text-right'>Reached</TableHead>
                                <TableHead>By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-muted-foreground'>
                                        Loading…
                                    </TableCell>
                                </TableRow>
                            )}
                            {isError && (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-destructive'>
                                        Couldn&apos;t load the alert log.
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading && !isError && events.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-muted-foreground'>
                                        No alert events yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {events.map((e) => (
                                <TableRow key={e.id}>
                                    <TableCell
                                        className='whitespace-nowrap text-muted-foreground'
                                        title={new Date(e.created_at).toLocaleString()}
                                    >
                                        {formatDistanceToNow(new Date(e.created_at), {
                                            addSuffix: true,
                                        })}
                                    </TableCell>
                                    <TableCell className='font-medium'>
                                        {e.barangay_name ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <LevelCell level={e.level} />
                                    </TableCell>
                                    <TableCell>
                                        <span className='flex items-center gap-2'>
                                            {KIND_LABELS[e.kind]}
                                            {e.suppressed && (
                                                <Badge variant='outline'>Muted</Badge>
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell className='text-right tabular-nums'>
                                        {e.recipients}
                                    </TableCell>
                                    <TableCell className='text-muted-foreground'>
                                        {e.triggered_by_username ?? 'System'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <div className='flex items-center justify-between border-t px-6 py-3 text-sm text-muted-foreground'>
                <span>
                    {data?.count ?? 0} event{data?.count === 1 ? '' : 's'}
                    {isFetching && ' · refreshing…'}
                </span>
                <div className='flex items-center gap-2'>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        size='sm'
                        variant='outline'
                        className='cursor-pointer'
                        disabled={!data?.previous}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        className='cursor-pointer'
                        disabled={!data?.next}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default AlertLogTable
