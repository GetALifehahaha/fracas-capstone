/**
 * Builds a locally-signed-looking JWT for the mock auth flow (branch `ui-build`
 * has no backend to issue real tokens). `core/decodeJwt.ts` only ever reads the
 * payload, never verifies the signature, so any well-formed 3-segment string
 * satisfies it.
 *
 * Encodes base64url by hand (no `btoa`, which — like `atob`/`Buffer` — isn't
 * reliably present in the RN/Hermes runtime; see decodeJwt.ts's matching
 * hand-rolled decoder).
 */
import type { Role } from '@/common/types/Role'

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function utf8Encode(input: string): number[] {
    const bytes: number[] = []
    for (let i = 0; i < input.length; i++) {
        let code = input.charCodeAt(i)
        if (code >= 0xd800 && code <= 0xdbff && i + 1 < input.length) {
            const next = input.charCodeAt(i + 1)
            if (next >= 0xdc00 && next <= 0xdfff) {
                code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00)
                i++
            }
        }
        if (code < 0x80) {
            bytes.push(code)
        } else if (code < 0x800) {
            bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
        } else if (code < 0x10000) {
            bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
        } else {
            bytes.push(
                0xf0 | (code >> 18),
                0x80 | ((code >> 12) & 0x3f),
                0x80 | ((code >> 6) & 0x3f),
                0x80 | (code & 0x3f),
            )
        }
    }
    return bytes
}

function bytesToBase64Url(bytes: number[]): string {
    let result = ''
    let i = 0
    for (; i + 2 < bytes.length; i += 3) {
        const chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
        result += B64[(chunk >> 18) & 0x3f] + B64[(chunk >> 12) & 0x3f] + B64[(chunk >> 6) & 0x3f] + B64[chunk & 0x3f]
    }
    const remaining = bytes.length - i
    if (remaining === 1) {
        const chunk = bytes[i] << 16
        result += B64[(chunk >> 18) & 0x3f] + B64[(chunk >> 12) & 0x3f]
    } else if (remaining === 2) {
        const chunk = (bytes[i] << 16) | (bytes[i + 1] << 8)
        result += B64[(chunk >> 18) & 0x3f] + B64[(chunk >> 12) & 0x3f] + B64[(chunk >> 6) & 0x3f]
    }
    return result
}

const base64UrlEncode = (value: string): string => bytesToBase64Url(utf8Encode(value))

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

/** Mints a fake refresh token (opaque string; only its presence/shape matters
 * to the mock flow, since there's no real server to validate it against). */
export const createFakeRefreshToken = (): string => `mock-refresh.${base64UrlEncode(String(Date.now()))}`
