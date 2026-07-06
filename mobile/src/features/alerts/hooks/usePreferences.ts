import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getPreferences, updatePreferences } from '../api/alertsApi'
import { alertKeys } from '../api/queryKeys'
import type { NotificationPreference } from '../types'

/** The resident's channel opt-ins + quiet hours. */
export const usePreferences = () =>
    useQuery({
        queryKey: alertKeys.preferences,
        queryFn: getPreferences,
        staleTime: 5 * 60_000,
    })

/** Patch preferences, writing the server response straight into the cache. */
export const useUpdatePreferences = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (patch: Partial<NotificationPreference>) => updatePreferences(patch),
        onSuccess: (data) => qc.setQueryData(alertKeys.preferences, data),
    })
}
