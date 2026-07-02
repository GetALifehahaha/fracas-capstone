import { useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useSearchParams } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/common/ui/table'
import { Badge } from '@/common/ui/badge'
import { Button } from '@/common/ui/button'
import { Card } from '@/common/ui/card'
import { useBarangays } from '@/features/gis/hooks/useBarangays'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/ui/select'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/common/ui/pagination'
import { cn } from '@/common/utils/utils'
import { RISK_COLORS, CATEGORY_LABELS } from '@/features/gis/constants/risk'
import { useAlertEvents } from '../hooks/useAlertEvents'
import { KIND_LABELS, KIND_FILTERS, SOURCE_LABELS } from '../constants/alerts'
import { getPageItems } from '../utils/pageItems'
import AlertEventDetailDialog from './AlertEventDetailDialog'
import type { AlertEvent, AlertEventKind, AlertEventSource } from '../types/api'

const PAGE_SIZE = 25
const COLS = 6

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
    const [kind, setKind] = useState<AlertEventKind | 'all'>('all')
    const [source, setSource] = useState<AlertEventSource | 'all'>('all')
    const [page, setPage] = useState(1)

    // Barangay filter is URL-driven so the map panel can deep-link into it.
    const [searchParams, setSearchParams] = useSearchParams()
    const barangayParam = searchParams.get('barangay')
    const barangayId = barangayParam ? Number(barangayParam) : undefined

    const { data: barangays } = useBarangays()
    const barangayOptions = useMemo(
        () =>
            (barangays?.features ?? [])
                .map((f) => ({ id: f.properties.id, name: f.properties.name }))
                .sort((a, b) => a.name.localeCompare(b.name)),
        [barangays],
    )
    const barangayName = barangayOptions.find((o) => o.id === barangayId)?.name

    // A changed barangay filter resets to the first page (adjust-during-render).
    const [lastBarangay, setLastBarangay] = useState(barangayId)
    if (barangayId !== lastBarangay) {
        setLastBarangay(barangayId)
        setPage(1)
    }

    const setBarangayFilter = (value: string) => {
        const next = new URLSearchParams(searchParams)
        if (value === 'all') next.delete('barangay')
        else next.set('barangay', value)
        setSearchParams(next, { replace: true })
    }

    const [selected, setSelected] = useState<AlertEvent | null>(null)

    const filters = {
        page,
        ...(kind !== 'all' && { kind }),
        ...(source !== 'all' && { source }),
        ...(barangayId && { barangay: barangayId }),
    }
    const { data, isLoading, isError } = useAlertEvents(filters)

    const events = data?.results ?? []
    const count = data?.count ?? 0
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))
    const start = count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
    const end = Math.min(page * PAGE_SIZE, count)

    const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages))
    const resetTo = <T,>(setter: (v: T) => void) => (value: T) => {
        setter(value)
        setPage(1)
    }

    return (
        <div>
            <Card size='sm' className='flex flex-row items-center gap-2 my-4'>
                <Select
                    value={barangayId ? String(barangayId) : 'all'}
                    onValueChange={(v) => setBarangayFilter(v as string)}
                >
                    <SelectTrigger className='w-56'>
                        <SelectValue>
                            {(v) =>
                                v === 'all' ? 'All barangays' : (barangayName ?? `Barangay #${v}`)
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='max-h-72' alignItemWithTrigger={true}>
                        <SelectItem value='all'>All barangays</SelectItem>
                        {barangayOptions.map((o) => (
                            <SelectItem key={o.id} value={String(o.id)}>
                                {o.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={kind} onValueChange={(v) => resetTo(setKind)(v as AlertEventKind | 'all')}>
                    <SelectTrigger className='w-44'>
                        <SelectValue>
                            {(v) => (v === 'all' ? 'All events' : KIND_LABELS[v as AlertEventKind])}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All events</SelectItem>
                        {KIND_FILTERS.map((k) => (
                            <SelectItem key={k.value} value={k.value}>
                                {k.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={source}
                    onValueChange={(v) => resetTo(setSource)(v as AlertEventSource | 'all')}
                >
                    <SelectTrigger className='w-40'>
                        <SelectValue>
                            {(v) => (v === 'all' ? 'All sources' : SOURCE_LABELS[v as AlertEventSource])}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All sources</SelectItem>
                        <SelectItem value='automated'>Automated</SelectItem>
                        <SelectItem value='operator'>Operator</SelectItem>
                    </SelectContent>
                </Select>

                {(kind !== 'all' || source !== 'all' || barangayId) && (
                    <Button
                        size='sm'
                        variant='ghost'
                        className='text-black/50 cursor-pointer'
                        onClick={() => {
                            setKind('all')
                            setSource('all')
                            setBarangayFilter('all')
                            setPage(1)
                        }}
                    >
                        Clear
                    </Button>
                )}
            </Card>

            <Table className='border-border border rounded'>
                <TableHeader className='bg-accent'>
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
                            <TableCell colSpan={COLS} className='text-black/50'>
                                Loading…
                            </TableCell>
                        </TableRow>
                    )}
                    {isError && (
                        <TableRow>
                            <TableCell colSpan={COLS} className='text-destructive'>
                                Couldn&apos;t load the alert log.
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && !isError && events.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={COLS} className='text-black/50'>
                                No alert events yet.
                            </TableCell>
                        </TableRow>
                    )}
                    {events.map((e) => (
                        <TableRow
                            key={e.id}
                            className='cursor-pointer'
                            onClick={() => setSelected(e)}
                        >
                            <TableCell
                                className='whitespace-nowrap text-black/60'
                                title={new Date(e.created_at).toLocaleString()}
                            >
                                {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                            </TableCell>
                            <TableCell className='font-medium'>{e.barangay_name ?? '—'}</TableCell>
                            <TableCell>
                                <LevelCell level={e.level} />
                            </TableCell>
                            <TableCell>
                                <span className='flex items-center gap-2'>
                                    {KIND_LABELS[e.kind]}
                                    {e.suppressed && <Badge variant='outline'>Muted</Badge>}
                                </span>
                            </TableCell>
                            <TableCell className='text-right tabular-nums'>{e.recipients}</TableCell>
                            <TableCell className='text-black/60'>
                                {e.triggered_by_username ?? 'System'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2}>
                            <span className='font-light text-sm'>
                                {count === 0
                                    ? 'No records'
                                    : `Showing ${start}-${end} of ${count} record${count === 1 ? '' : 's'}`}
                            </span>
                        </TableCell>
                        <TableCell colSpan={COLS - 2}>
                            <Pagination>
                                <PaginationContent className='ml-auto'>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            className={cn(page === 1 && 'pointer-events-none opacity-50')}
                                            onClick={() => goTo(page - 1)}
                                        />
                                    </PaginationItem>
                                    {getPageItems(page, totalPages).map((item, i) =>
                                        item === 'ellipsis' ? (
                                            <PaginationItem key={`e${i}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        ) : (
                                            <PaginationItem key={item}>
                                                <PaginationLink
                                                    isActive={item === page}
                                                    onClick={() => goTo(item)}
                                                >
                                                    {item}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ),
                                    )}
                                    <PaginationItem>
                                        <PaginationNext
                                            className={cn(
                                                page === totalPages && 'pointer-events-none opacity-50',
                                            )}
                                            onClick={() => goTo(page + 1)}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            <AlertEventDetailDialog event={selected} onClose={() => setSelected(null)} />
        </div>
    )
}

export default AlertLogTable
