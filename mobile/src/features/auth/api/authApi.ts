/**
 * Auth endpoints. Branch `ui-build` runs with no backend — login/refresh mint a
 * locally-signed-looking JWT pair instead of calling the real
 * `/api/auth/jwt/create|refresh/` endpoints. Kept as a separate module (not
 * routed through `apiClient`) so its shape matches the real "raw axios, no
 * refresh interceptor" contract even though there's nothing to dodge anymore.
 */
import { decodeJwt } from '@/core/decodeJwt'
import type { Role } from '@/common/types/Role'
import { createFakeAccessToken } from '@/mocks/fakeJwt'
import { setCurrentUserRole } from '@/mocks/db'
import { delay } from '@/mocks/utils'

import type { LoginCredentials, TokenPair } from '../types/authTypes'

/** Demo logins for branch ui-build (no backend): the phone numbers below sign
 * in as `admin`/`operator`; any other validly-formatted PH mobile number signs
 * in as `resident`. Any password is accepted. */
const ROLE_BY_PHONE: Record<string, Role> = {
    '+639170000001': 'admin',
    '+639170000002': 'operator',
}
const roleForPhone = (phone: string): Role => ROLE_BY_PHONE[phone] ?? 'resident'

/** Exchange credentials for an access + refresh pair (both in the body for mobile). */
export async function login(credentials: LoginCredentials): Promise<TokenPair> {
    await delay()
    const role = roleForPhone(credentials.username)
    const claims = { user_id: 1, username: credentials.username, role }
    setCurrentUserRole(role)
    return {
        access: createFakeAccessToken(claims),
        // The refresh token is itself a fake access-shaped JWT with a long TTL —
        // there's no server to validate it against, so `refreshAccess` below just
        // re-decodes it to restore the session's role on cold start.
        refresh: createFakeAccessToken(claims, 60 * 60 * 24 * 30),
    }
}

/** Validate a stored refresh token on cold start, returning a fresh access token. */
export async function refreshAccess(refresh: string): Promise<string> {
    await delay()
    const claims = decodeJwt(refresh)
    const role = claims?.role ?? 'resident'
    setCurrentUserRole(role)
    return createFakeAccessToken({
        user_id: claims?.user_id ?? 1,
        username: claims?.username ?? 'resident',
        role,
    })
}
