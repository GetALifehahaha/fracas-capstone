/** The signed-in user's own account-change history, captured from the live
 * dev backend (GET /api/account/changes/). Reused for the admin per-user
 * changes endpoint too (GET /api/admin/users/:id/changes/). */
import type { AccountChange } from '@/features/user/types'

const accountChangesFixture: AccountChange[] = [
    { id: 11, action: 'password_changed', field: '', old_value: '', new_value: '', changed_at: '2026-07-09T20:36:48.471916Z', actor_name: 'Root Root' },
    { id: 10, action: 'password_changed', field: '', old_value: '', new_value: '', changed_at: '2026-07-09T20:36:41.666533Z', actor_name: 'Root Root' },
    { id: 9, action: 'password_changed', field: '', old_value: '', new_value: '', changed_at: '2026-07-09T20:36:25.570802Z', actor_name: 'Root Root' },
    { id: 8, action: 'password_changed', field: '', old_value: '', new_value: '', changed_at: '2026-07-09T20:36:12.727932Z', actor_name: 'Root Root' },
    { id: 6, action: 'updated', field: 'first_name', old_value: 'Roott', new_value: 'Root', changed_at: '2026-07-05T02:56:54.031206Z', actor_name: 'Root Root' },
    { id: 5, action: 'updated', field: 'first_name', old_value: 'Root', new_value: 'Roott', changed_at: '2026-07-05T02:56:48.721467Z', actor_name: 'Root Root' },
    { id: 4, action: 'updated', field: 'address', old_value: '', new_value: 'Paniran Resettlement Zone IV, San Jose Cawa-cawa, City of Zamboanga, Zamboanga Del Sur, 7000, Philippines', changed_at: '2026-07-04T05:25:26.837625Z', actor_name: 'Root Root' },
    { id: 3, action: 'updated', field: 'phone_number', old_value: '', new_value: '+639942867630', changed_at: '2026-07-04T05:25:26.837613Z', actor_name: 'Root Root' },
]

export default accountChangesFixture
