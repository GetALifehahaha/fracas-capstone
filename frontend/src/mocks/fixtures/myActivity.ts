/** The signed-in operator's own flood-event actions, captured from the live
 * dev backend (GET /api/flood-events/my-activity/). */
import type { FloodActivity } from '@/features/user/types'

const myActivityFixture: FloodActivity[] = [
    { id: 10, flood_event: 5, barangay_name: 'Arena Blanco', action: 'confirmed', changed_at: '2026-07-07T00:10:26.059266Z' },
    { id: 9, flood_event: 5, barangay_name: 'Arena Blanco', action: 'resolved', changed_at: '2026-07-07T00:10:20.187459Z' },
    { id: 5, flood_event: 4, barangay_name: 'Tumaga', action: 'confirmed', changed_at: '2026-07-05T02:32:07.596259Z' },
    { id: 3, flood_event: 2, barangay_name: 'Guiwan', action: 'resolved', changed_at: '2026-07-03T14:29:58.727509Z' },
    { id: 2, flood_event: 2, barangay_name: 'Guiwan', action: 'updated', changed_at: '2026-07-03T14:29:42.057977Z' },
    { id: 1, flood_event: 2, barangay_name: 'Guiwan', action: 'updated', changed_at: '2026-07-03T12:48:17.204550Z' },
]

export default myActivityFixture
