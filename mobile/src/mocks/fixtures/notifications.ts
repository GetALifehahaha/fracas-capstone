/** Demo in-app alert feed — no live equivalent captured (mobile-only entity), so
 * these are hand-authored but reference real barangays from the barangays fixture.
 * Mixed read/unread, newest first, a couple per barangay. */
import type { Notification } from '@/features/alerts/types'

const notificationsFixture: Notification[] = [
    {
        id: 1,
        barangay: 25,
        barangay_name: 'Guiwan',
        category: 'high',
        title: 'Guiwan flood risk elevated to High',
        body: 'Sustained rainfall over the last 6 hours has pushed Guiwan into the High hazard band. Stay alert for further advisories.',
        is_read: false,
        created_at: new Date(Date.now() - 20 * 60_000).toISOString(),
    },
    {
        id: 2,
        barangay: 88,
        barangay_name: 'Tumaga',
        category: 'critical',
        title: 'Tumaga flood risk at Critical',
        body: 'Tumaga has reached Critical hazard. Residents near the riverbank are advised to move to higher ground or the nearest evacuation center.',
        is_read: false,
        created_at: new Date(Date.now() - 90 * 60_000).toISOString(),
    },
    {
        id: 3,
        barangay: 25,
        barangay_name: 'Guiwan',
        category: 'medium',
        title: 'Guiwan risk easing to Medium',
        body: 'Rainfall has tapered off and Guiwan has been downgraded from High to Medium.',
        is_read: true,
        created_at: new Date(Date.now() - 5 * 60 * 60_000).toISOString(),
    },
    {
        id: 4,
        barangay: 3,
        barangay_name: 'Baliwasan',
        category: 'low',
        title: 'Baliwasan back to Low risk',
        body: 'Flood hazard in Baliwasan has returned to Low following 24 hours without significant rainfall.',
        is_read: true,
        created_at: new Date(Date.now() - 22 * 60 * 60_000).toISOString(),
    },
    {
        id: 5,
        barangay: 58,
        barangay_name: 'Barangay Zone IV (Pob.)',
        category: 'medium',
        title: 'Zone IV (Pob.) flood risk at Medium',
        body: 'Rising rainfall accumulation has raised Zone IV (Pob.) to Medium hazard.',
        is_read: false,
        created_at: new Date(Date.now() - 26 * 60 * 60_000).toISOString(),
    },
    {
        id: 6,
        barangay: null,
        barangay_name: null,
        category: 'low',
        title: 'Weekly summary',
        body: 'No barangays reached High or Critical hazard this week. Stay prepared — check your go-bag checklist in the Toolkit tab.',
        is_read: true,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60_000).toISOString(),
    },
    {
        id: 7,
        barangay: 88,
        barangay_name: 'Tumaga',
        category: 'high',
        title: 'Tumaga downgraded to High',
        body: 'Tumaga has eased from Critical to High. Continue monitoring the map for updates.',
        is_read: true,
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60_000).toISOString(),
    },
    {
        id: 8,
        barangay: 3,
        barangay_name: 'Baliwasan',
        category: 'medium',
        title: 'Baliwasan flood risk at Medium',
        body: 'Baliwasan has been raised from Low to Medium hazard due to increasing dam discharge.',
        is_read: true,
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60_000).toISOString(),
    },
]

export default notificationsFixture
