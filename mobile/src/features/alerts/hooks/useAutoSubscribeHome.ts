import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import { useRiskMap } from '@/features/gis/hooks/useRiskMap'
import { useHomeBarangay } from '@/features/status/hooks/useHomeBarangay'

import { getSubscriptions, subscribe } from '../api/alertsApi'
import { alertKeys } from '../api/queryKeys'

const AUTO_SUBSCRIBED_KEY = 'fracas:auto-subscribed'

/**
 * Silently subscribe a resident to their home barangay the first time it resolves,
 * so alerts reach them without any setup. Fires at most once ever (guarded by a
 * persisted flag) — after that the resident owns the toggle and we never re-add a
 * subscription they've deliberately removed. Mount once, near the app root.
 */
export const useAutoSubscribeHome = (): void => {
    const qc = useQueryClient()
    const { features } = useRiskMap()
    const home = useHomeBarangay(features)
    const barangayId = home.feature?.properties.id ?? null
    const attempted = useRef(false)

    const subs = useQuery({
        queryKey: alertKeys.subscriptions,
        queryFn: getSubscriptions,
        staleTime: 5 * 60_000,
    })

    const subscribeMut = useMutation({
        mutationFn: (id: number) => subscribe(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: alertKeys.subscriptions }),
    })

    useEffect(() => {
        if (attempted.current || barangayId == null || subs.data == null) return
        attempted.current = true

        void (async () => {
            if (await AsyncStorage.getItem(AUTO_SUBSCRIBED_KEY)) return
            const markDone = () => AsyncStorage.setItem(AUTO_SUBSCRIBED_KEY, '1')

            // Already subscribed → nothing to do; otherwise only mark the one-time
            // flag once the subscription is confirmed, so a failed POST retries.
            if (subs.data.some((s) => s.barangay === barangayId)) {
                await markDone()
                return
            }
            subscribeMut.mutate(barangayId, { onSuccess: () => void markDone() })
        })()
        // Guarded by the `attempted` ref; only re-run when the inputs resolve.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [barangayId, subs.data])
}
