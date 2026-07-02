import type { AlertEventKind, AlertEventSource } from '../types/api'

/** Human labels for each transition kind (audit-log "Event" column). */
export const KIND_LABELS: Record<AlertEventKind, string> = {
    entered: 'Entered critical',
    renotify: 'Re-alert',
    all_clear: 'All clear',
    broadcast: 'Broadcast',
}

/** Human labels for the event source. */
export const SOURCE_LABELS: Record<AlertEventSource, string> = {
    automated: 'Automated',
    operator: 'Operator',
}

/** Filter options for the log, in a sensible reading order. */
export const KIND_FILTERS: { value: AlertEventKind; label: string }[] = [
    { value: 'entered', label: KIND_LABELS.entered },
    { value: 'renotify', label: KIND_LABELS.renotify },
    { value: 'all_clear', label: KIND_LABELS.all_clear },
    { value: 'broadcast', label: KIND_LABELS.broadcast },
]
