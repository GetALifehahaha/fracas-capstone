/** One profile per demo login (see AuthProvider.tsx / Login.tsx demo accounts:
 * `admin`, `operator`, `resident`, any password). Admin's address is the real
 * value captured from the live dev backend's `root` user. */
import type { Role } from '@/common/types/Role'
import type { CurrentUser } from '@/features/user/types'

const currentUserFixture: Record<Role, CurrentUser> = {
    admin: {
        id: 2,
        username: 'admin',
        email: 'root@root.rt',
        first_name: 'Root',
        last_name: 'Root',
        phone_number: null,
        address: {
            unit: 'Paniran Resettlement Zone IV',
            province: 'Zamboanga Del Sur',
            province_code: '097300000',
            city: 'City of Zamboanga',
            city_code: '097332000',
            barangay: 'San Jose Cawa-cawa',
            barangay_code: '097332070',
            country: 'Philippines',
            zip_code: '7000',
        },
        is_active: true,
        role: 'admin',
    },
    operator: {
        id: 6,
        username: 'operator',
        email: 'operator@fracas.local',
        first_name: 'Operator',
        last_name: 'Account',
        phone_number: '+639171234567',
        address: {
            unit: '',
            province: 'Zamboanga Del Sur',
            province_code: '097300000',
            city: 'City of Zamboanga',
            city_code: '097332000',
            barangay: 'Tetuan',
            barangay_code: '097332081',
            country: 'Philippines',
            zip_code: '7000',
        },
        is_active: true,
        role: 'operator',
    },
    resident: {
        id: 7,
        username: 'resident',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '+639942867630',
        address: {
            unit: '',
            province: 'Zamboanga Del Sur',
            province_code: '097300000',
            city: 'City of Zamboanga',
            city_code: '097332000',
            barangay: 'Guiwan',
            barangay_code: '097332025',
            country: 'Philippines',
            zip_code: '7000',
        },
        is_active: true,
        role: 'resident',
    },
}

export default currentUserFixture
