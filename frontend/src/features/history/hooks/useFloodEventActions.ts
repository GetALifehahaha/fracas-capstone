import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    confirmFloodEvent,
    resolveFloodEvent,
    restoreFloodEvent,
} from '../api/floodEventsApi'
import type { FloodEventDetail } from '../types/api'
import { floodEventKeys } from './queryKeys'

/** Refresh the list, this event's detail and its audit trail after a lifecycle change. */
const useEventInvalidator = () => {
    const queryClient = useQueryClient()
    return (event: FloodEventDetail) => {
        queryClient.setQueryData(floodEventKeys.detail(event.id), event)
        queryClient.invalidateQueries({ queryKey: ['floodEvents', 'list'] })
        queryClient.invalidateQueries({ queryKey: floodEventKeys.changes(event.id) })
    }
}

/** Confirm an auto-drafted event (records the confirming operator). */
export const useConfirmFloodEvent = () => {
    const invalidate = useEventInvalidator()
    return useMutation({
        mutationFn: (id: number) => confirmFloodEvent(id),
        onSuccess: invalidate,
    })
}

/** Resolve an event by setting its end time. */
export const useResolveFloodEvent = () => {
    const invalidate = useEventInvalidator()
    return useMutation({
        mutationFn: ({ id, endedAt }: { id: number; endedAt: string }) =>
            resolveFloodEvent(id, endedAt),
        onSuccess: invalidate,
    })
}

/** Undo a soft-delete within the recovery window. */
export const useRestoreFloodEvent = () => {
    const invalidate = useEventInvalidator()
    return useMutation({
        mutationFn: (id: number) => restoreFloodEvent(id),
        onSuccess: invalidate,
    })
}
