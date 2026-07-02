import type { AlertEventFilters } from '../types/api'

/** Centralized query keys for the alerts feature. */
export const alertKeys = {
    events: (filters: AlertEventFilters) => ['alerts', 'events', filters] as const,
}
