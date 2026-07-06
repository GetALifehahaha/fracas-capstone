import { useInfiniteQuery } from '@tanstack/react-query'

import { getNotifications } from '../api/alertsApi'
import { alertKeys } from '../api/queryKeys'
import type { Notification } from '../types'

/**
 * The resident's notification feed, paginated. Flatten `data.pages` for the list;
 * `fetchNextPage` loads older alerts as they scroll. Persisted, so the last-seen
 * page survives a cold start offline.
 */
export const useNotifications = () => {
    const query = useInfiniteQuery({
        queryKey: alertKeys.notifications,
        queryFn: ({ pageParam }) => getNotifications(pageParam),
        initialPageParam: 1,
        // DRF returns an absolute `next` URL; presence means there's another page.
        getNextPageParam: (last, pages) => (last.next ? pages.length + 1 : undefined),
    })

    const notifications: Notification[] = query.data?.pages.flatMap((p) => p.results) ?? []
    return { ...query, notifications }
}
