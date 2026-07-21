/** Console user accounts, captured from the live dev backend (GET /api/admin/users/). */
import type { AdminUser } from '@/features/admin/types/user'

const adminUsersFixture: AdminUser[] = [
    { id: 2, username: 'root', email: 'root@root.rt', first_name: 'Root', last_name: 'Root', phone_number: null, phone_verified: false, is_active: true, is_operator: true, is_staff: true, role: 'admin', date_joined: '2026-07-02T03:33:56Z', last_login: '2026-07-09T20:36:58Z' },
    { id: 3, username: 'op_staff_probe', email: '', first_name: '', last_name: '', phone_number: null, phone_verified: false, is_active: true, is_operator: false, is_staff: true, role: 'admin', date_joined: '2026-07-02T10:14:41.876677Z', last_login: null },
    { id: 6, username: 'smoke_op', email: '', first_name: '', last_name: '', phone_number: null, phone_verified: false, is_active: true, is_operator: true, is_staff: false, role: 'operator', date_joined: '2026-07-06T03:51:49.764463Z', last_login: null },
    { id: 7, username: 'smoke_res', email: '', first_name: '', last_name: '', phone_number: null, phone_verified: false, is_active: true, is_operator: false, is_staff: false, role: 'resident', date_joined: '2026-07-06T03:52:38.881664Z', last_login: null },
    { id: 11, username: '+639942867630', email: '', first_name: '', last_name: '', phone_number: '+639942867630', phone_verified: true, is_active: true, is_operator: false, is_staff: false, role: 'resident', date_joined: '2026-07-09T23:27:42.585029Z', last_login: null },
]

export default adminUsersFixture
