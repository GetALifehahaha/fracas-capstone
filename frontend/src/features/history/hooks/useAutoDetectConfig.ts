import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAutoDetectConfig, updateAutoDetectConfig } from '../api/floodEventsApi'
import type { AutoDetectConfig } from '../types/api'
import { floodEventKeys } from './queryKeys'

/** Read the auto-detection config singleton (admin-only). */
export const useAutoDetectConfig = () =>
    useQuery({
        queryKey: floodEventKeys.autoDetectConfig(),
        queryFn: getAutoDetectConfig,
    })

/** Update the auto-detection config (admin-only). */
export const useUpdateAutoDetectConfig = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: Partial<Pick<AutoDetectConfig, 'enabled' | 'threshold_category'>>) =>
            updateAutoDetectConfig(payload),
        onSuccess: (config) => {
            queryClient.setQueryData(floodEventKeys.autoDetectConfig(), config)
        },
    })
}
