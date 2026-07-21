/**
 * Anonymous phone-first registration endpoints (3 phases). Branch `ui-build`
 * runs with no backend — every phase is a no-op that "succeeds" after a short
 * delay; `verify` accepts any 6-digit code (the UI's zod schema already
 * enforces the 6-digit shape, mirroring this project's existing `123456`
 * OTP dev-bypass convention). Kept as a separate module (not routed through
 * `apiClient`) to match the real "raw axios, pre-auth" contract.
 */
import type { PublicBarangayCollection } from '@/features/gis/types'
import { setCurrentUserRole } from '@/mocks/db'
import barangaysFixture from '@/mocks/fixtures/barangays'
import { createFakeAccessToken } from '@/mocks/fakeJwt'
import { delay } from '@/mocks/utils'

import type { TokenPair } from '@/features/auth/types/authTypes'
import type { RegistrationAddress } from '../types'

/** Public barangay boundaries (geometry + name) for pre-auth point-in-polygon.
 * Derived from the full barangays fixture (same ids/names/geometry) rather
 * than hand-authoring a second copy of the geometry. */
export async function getPublicBarangays(): Promise<PublicBarangayCollection> {
    await delay()
    return {
        type: 'FeatureCollection',
        features: barangaysFixture.features.map((feature) => ({
            type: 'Feature',
            geometry: feature.geometry,
            properties: { id: feature.properties.id, name: feature.properties.name },
        })),
    }
}

/** Phase 1 — create the pending account and send an OTP. */
export async function registerStart(_phone_number: string, _address: RegistrationAddress): Promise<void> {
    await delay()
}

/** Re-send the OTP for a pending registration. */
export async function registerResend(_phone_number: string): Promise<void> {
    await delay()
}

/** Phase 2 — verify the OTP (records terms acceptance server-side). Any
 * 6-digit code is accepted — the form's zod schema already enforces the shape. */
export async function registerVerify(_phone_number: string, _code: string): Promise<void> {
    await delay()
}

/** Phase 3 — set the password, activate, and receive tokens (lands logged in).
 * New registrants have no username to infer a demo role from, so they always
 * land as `resident`. */
export async function registerSetPassword(phone_number: string, _password: string): Promise<TokenPair> {
    await delay()
    setCurrentUserRole('resident')
    const claims = { user_id: 1, username: phone_number, role: 'resident' as const }
    return {
        access: createFakeAccessToken(claims),
        refresh: createFakeAccessToken(claims, 60 * 60 * 24 * 30),
    }
}
