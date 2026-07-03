import type { Role } from '@/common/types/Role'

/** The signed-in user's own profile (djoser `/api/auth/users/me/`). */
export interface CurrentUser {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    phone_number: string | null
    is_active: boolean
    /** Derived console role; read-only (see backend `User.role`). */
    role: Role
}

/** Editable slice of the profile (PATCH `/users/me/`). */
export type ProfileUpdate = Pick<CurrentUser, 'first_name' | 'last_name' | 'email'>

/** Payload for djoser `set_password` (no retype server-side). */
export interface PasswordChange {
    current_password: string
    new_password: string
}
