/** Branch `ui-build` runs with no backend — reads/writes hit the in-memory mock db. */
import * as db from '@/mocks/db'
import { delay } from '@/mocks/utils'

import type { CurrentUser, PasswordChange, ProfileUpdate } from '../types'

/** The signed-in user's own profile (djoser `/users/me/`). */
export const getCurrentUser = async (): Promise<CurrentUser> => {
    await delay()
    return db.getCurrentUser()
}

/** Update editable profile fields (name, email, permanent address). */
export const updateCurrentUser = async (payload: ProfileUpdate): Promise<CurrentUser> => {
    await delay()
    return db.updateCurrentUser(payload)
}

/** Change the account password (djoser `set_password`; 204 on success). */
export const changePassword = async (payload: PasswordChange): Promise<void> => {
    await delay()
    db.changePassword(payload)
}
