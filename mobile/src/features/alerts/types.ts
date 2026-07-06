import type { RiskCategory } from '@/features/gis/types'

/** DRF page envelope (page-number pagination, size 25). */
export interface Paginated<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

/** One row of GET /api/notifications/ — the resident's in-app alerts feed. */
export interface Notification {
    id: number
    barangay: number | null
    barangay_name: string | null
    /** Severity of the alert (reuses the risk ramp). */
    category: RiskCategory
    title: string
    body: string
    is_read: boolean
    created_at: string
}

/** The channels an alert can be delivered over (matches the backend prefs). */
export type Channel = 'inapp' | 'push' | 'sms'

/**
 * GET/PATCH /api/account/preferences/. Quiet hours are local-time "HH:MM:SS"
 * strings (or null); during the window only in-app alerts are delivered.
 */
export interface NotificationPreference {
    inapp_enabled: boolean
    push_enabled: boolean
    sms_enabled: boolean
    quiet_hours_start: string | null
    quiet_hours_end: string | null
}

/** A registered push target (POST /api/account/devices/). */
export interface Device {
    id: number
    token: string
    platform: 'android' | 'ios' | 'web'
    is_active: boolean
    created_at: string
}

/** A barangay the resident subscribes to for alerts (GET /api/account/subscriptions/). */
export interface Subscription {
    id: number
    barangay: number
    barangay_name: string
    created_at: string
}
