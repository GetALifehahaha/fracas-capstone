/** Builds a locally-signed-looking JWT for the mock auth flow (branch `ui-build`
 * has no backend to issue real tokens). `decodeJwt.ts` only ever reads the
 * payload, never verifies the signature, so any well-formed 3-segment string
 * satisfies it. */
import type { Role } from '@/common/types/Role'

const base64UrlEncode = (value: string): string =>
    btoa(unescape(encodeURIComponent(value)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

export interface FakeJwtClaims {
    user_id: number
    username: string
    role: Role
    exp: number
}

/** Mints a fake `header.payload.signature` access token carrying the given claims. */
export const createFakeAccessToken = (
    claims: Omit<FakeJwtClaims, 'exp'>,
    ttlSeconds = 60 * 60 * 12,
): string => {
    const header = base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }))
    const payload = base64UrlEncode(
        JSON.stringify({ ...claims, exp: Math.floor(Date.now() / 1000) + ttlSeconds }),
    )
    return `${header}.${payload}.mock-signature`
}
