/** Demo barangay subscriptions (mobile-only entity, no live capture). The
 * resident demo user starts pre-subscribed to their home barangay (Guiwan,
 * id 25 — see fixtures/currentUser.ts) so `useHomeSubscription` has something
 * to show without any setup. */
import type { Subscription } from '@/features/alerts/types'

const subscriptionsFixture: Subscription[] = [
    {
        id: 1,
        barangay: 25,
        barangay_name: 'Guiwan',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60_000).toISOString(),
    },
]

export default subscriptionsFixture
