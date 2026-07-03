import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFloodEvent } from '../api/floodEventsApi'

/** Delete a flood event, then refresh the list. */
export const useDeleteFloodEvent = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deleteFloodEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['floodEvents'] })
        },
    })
}
