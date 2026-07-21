/** Branch ui-build runs with no backend — served from an in-memory mock db. */
import type { AccountChange, Paginated } from '@/features/user/types'
import type {
    AdminUser,
    AdminUserFilters,
    CreateUserPayload,
    ResetPasswordResult,
    UpdateUserPayload,
} from '../types/user'
import * as db from '@/mocks/db'
import { delay, paginate } from '@/mocks/utils'

export const getAdminUsers = async (
    filters: AdminUserFilters = {},
): Promise<Paginated<AdminUser>> => {
    await delay()
    return paginate(db.listAdminUsers(filters), filters.page)
}

export const getAdminUser = async (id: number): Promise<AdminUser> => {
    await delay()
    const user = db.getAdminUser(id)
    if (!user) throw new Error(`Admin user ${id} not found`)
    return user
}

export const createAdminUser = async (payload: CreateUserPayload): Promise<AdminUser> => {
    await delay(400)
    return db.createAdminUser(payload)
}

export const updateAdminUser = async (
    id: number,
    payload: UpdateUserPayload,
): Promise<AdminUser> => {
    await delay(400)
    return db.updateAdminUser(id, payload)
}

/** `id` isn't needed by the mock store (there's only one demo password to
 * reset), but the parameter is kept so call sites don't need to change. */
export const resetAdminUserPassword = async (id: number): Promise<ResetPasswordResult> => {
    void id
    await delay(400)
    return db.resetAdminUserPassword()
}

/** `id` isn't needed by the mock store — see resetAdminUserPassword above. */
export const getAdminUserChanges = async (
    id: number,
    page = 1,
): Promise<Paginated<AccountChange>> => {
    void id
    await delay()
    return paginate(db.listAdminUserChanges(), page)
}
