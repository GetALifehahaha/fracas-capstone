import { useQuery } from '@tanstack/react-query'
import { getFloodEventChanges } from '../api/floodEventsApi'
import { floodEventKeys } from './queryKeys'

/** Append-only audit trail for one event. Fetched lazily (e.g. when a modal opens). */
export const useFloodEventChanges = (id: number | undefined, enabled = true) =>
    useQuery({
        queryKey: floodEventKeys.changes(id ?? 0),
        queryFn: () => getFloodEventChanges(id as number),
        enabled: id != null && enabled,
    })
