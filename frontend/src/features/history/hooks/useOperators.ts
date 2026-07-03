import { useQuery } from '@tanstack/react-query'
import { getOperators } from '../api/floodEventsApi'

/** Operators + admins for the source picker. Small + stable, so cached generously. */
export const useOperators = (enabled = true) =>
    useQuery({
        queryKey: ['operators'],
        queryFn: getOperators,
        staleTime: 5 * 60 * 1000,
        enabled,
    })
