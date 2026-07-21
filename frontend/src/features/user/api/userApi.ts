/** Branch ui-build runs with no backend — served from an in-memory mock db. */
import type { CurrentUser, PasswordChange, ProfileUpdate } from '../types'
import * as db from '@/mocks/db'
import { delay } from '@/mocks/utils'

export const getCurrentUser = async (): Promise<CurrentUser> => {
    await delay()
    return db.getCurrentUser()
}

export const updateCurrentUser = async (payload: ProfileUpdate): Promise<CurrentUser> => {
    await delay(400)
    return db.updateCurrentUser(payload)
}

/** The mock store doesn't track a real password, so there's nothing to check
 * or update — the payload is kept so call sites don't need to change. */
export const changePassword = async (payload: PasswordChange): Promise<void> => {
    void payload
    await delay(400)
}
