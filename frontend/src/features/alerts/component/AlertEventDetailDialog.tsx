import type { ReactNode } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/common/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/common/ui/dialog'
import { RISK_COLORS, CATEGORY_LABELS } from '@/features/gis/constants/risk'
import { KIND_LABELS, SOURCE_LABELS } from '../constants/alerts'
import type { AlertEvent } from '../types/api'

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className='grid grid-cols-[9rem_1fr] items-center gap-2 py-2'>
        <dt className='text-xs text-muted-foreground'>{label}</dt>
        <dd className='text-sm'>{children}</dd>
    </div>
)

interface Props {
    event: AlertEvent | null
    onClose: () => void
}

/** Read-only full detail for a single alert event, opened from the log table. */
const AlertEventDetailDialog = ({ event, onClose }: Props) => (
    <Dialog open={!!event} onOpenChange={(next) => !next && onClose()}>
        <DialogContent className='sm:max-w-md'>
            {event && (
                <>
                    <DialogHeader>
                        <DialogTitle>
                            <span className='flex items-center gap-2'>
                                {KIND_LABELS[event.kind]}
                                {event.suppressed && <Badge variant='outline'>Muted</Badge>}
                            </span>
                        </DialogTitle>
                        <DialogDescription>
                            {new Date(event.created_at).toLocaleString()} ·{' '}
                            {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                        </DialogDescription>
                    </DialogHeader>

                    <dl className='divide-y divide-border'>
                        <Row label='Barangay'>{event.barangay_name ?? '—'}</Row>
                        <Row label='Level'>
                            <span className='flex items-center gap-2'>
                                <span
                                    className='aspect-square w-2 rounded-full ring-1 ring-foreground/10'
                                    style={{ backgroundColor: RISK_COLORS[event.level] }}
                                />
                                {CATEGORY_LABELS[event.level]}
                            </span>
                        </Row>
                        <Row label='Source'>{SOURCE_LABELS[event.source]}</Row>
                        <Row label='Triggered by'>{event.triggered_by_username ?? 'System'}</Row>
                        <Row label='Recipients reached'>{event.recipients}</Row>
                        {event.score != null && (
                            <Row label='Hazard score'>{Math.round(event.score)} / 100</Row>
                        )}
                        {event.suppressed && (
                            <Row label='Delivery'>Muted — no one was notified</Row>
                        )}
                    </dl>
                </>
            )}
        </DialogContent>
    </Dialog>
)

export default AlertEventDetailDialog
