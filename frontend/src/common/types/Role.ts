/**
 * Canonical console role — the single source of truth, mirroring the backend
 * `User.role` and the JWT `role` claim. Reused as `UserRole` in
 * `@/app/decodeJwt` and surfaced via `useAuth()`.
 */
export const ROLES = {
    resident: "resident",
    operator: "operator",
    admin: "admin",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
