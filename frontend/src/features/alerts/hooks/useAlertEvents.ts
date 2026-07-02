import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAlertEvents } from '../api/alertsApi'
import type { AlertEventFilters } from '../types/api'
import { alertKeys } from './queryKeys'

const REFRESH_MS = 60_000

/** Paginated audit log. Keeps previous page visible while the next loads. */
export const useAlertEvents = (filters: AlertEventFilters) =>
    useQuery({
        queryKey: alertKeys.events(filters),
        queryFn: () => getAlertEvents(filters),
        placeholderData: keepPreviousData,
        refetchInterval: REFRESH_MS,
    })
