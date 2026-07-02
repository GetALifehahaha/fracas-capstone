import type { AlertEventKind } from '../types/api'

/** Human labels for each transition kind (audit-log "Event" column). */
export const KIND_LABELS: Record<AlertEventKind, string> = {
    entered: 'Entered critical',
    renotify: 'Re-alert',
    all_clear: 'All clear',
    broadcast: 'Broadcast',
}

/** Filter options for the log, in a sensible reading order. */
export const KIND_FILTERS: { value: AlertEventKind; label: string }[] = [
    { value: 'entered', label: KIND_LABELS.entered },
    { value: 'renotify', label: KIND_LABELS.renotify },
    { value: 'all_clear', label: KIND_LABELS.all_clear },
    { value: 'broadcast', label: KIND_LABELS.broadcast },
]
