import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postBroadcast } from '../api/alertsApi'

/** Send an operator broadcast, then refresh the audit log it just appended to. */
export const useBroadcast = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: postBroadcast,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alerts', 'events'] })
        },
    })
}
