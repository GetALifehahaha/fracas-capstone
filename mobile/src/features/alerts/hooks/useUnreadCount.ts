import { useQuery } from '@tanstack/react-query'

import { getUnreadCount } from '../api/alertsApi'
import { alertKeys } from '../api/queryKeys'

const REFRESH_MS = 60_000 // surface new alerts within a minute while the app is open

/** Unread notification count for the tab badge + bell. Polls in the background. */
export const useUnreadCount = () =>
    useQuery({
        queryKey: alertKeys.unreadCount,
        queryFn: getUnreadCount,
        refetchInterval: REFRESH_MS,
        // A cached 0 shouldn't flash a badge; treat as always-slightly-stale.
        staleTime: 0,
    })
