import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFloodEvent, updateFloodEvent } from '../api/floodEventsApi'
import type { FloodEventInput } from '../types/api'

interface SaveArgs {
    id?: number
    payload: FloodEventInput
}

/** Create (no id) or edit (id) a flood event, then refresh the list + detail. */
export const useSaveFloodEvent = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: SaveArgs) =>
            id ? updateFloodEvent(id, payload) : createFloodEvent(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['floodEvents'] })
        },
    })
}
