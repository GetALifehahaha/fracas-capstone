/** In-memory mock "database" for branch ui-build (no backend). Seeded from
 * fixtures/*, mutated in place so create/update/delete actions feel real
 * within a session; resets on app reload. */
import type { Role } from '@/common/types/Role'
import type { CurrentUser, PasswordChange, ProfileUpdate } from '@/features/account/types'
import type { Device, Notification, NotificationPreference, Subscription } from '@/features/alerts/types'

import currentUserFixture from './fixtures/currentUser'
import notificationsFixture from './fixtures/notifications'
import subscriptionsFixture from './fixtures/subscriptions'
import { nextId } from './utils'

const clone = <T>(value: T): T => structuredClone(value)

const defaultPreferences: NotificationPreference = {
    inapp_enabled: true,
    push_enabled: true,
    sms_enabled: false,
    quiet_hours_start: '22:00:00',
    quiet_hours_end: '06:00:00',
}

const state = {
    currentUser: clone(currentUserFixture.resident),
    notifications: clone(notificationsFixture),
    preferences: clone(defaultPreferences),
    devices: [] as Device[],
    subscriptions: clone(subscriptionsFixture),
}

/** Swaps the "logged-in user" profile to match the demo role that just signed in. */
export const setCurrentUserRole = (role: Role): void => {
    state.currentUser = clone(currentUserFixture[role])
}

// --- Current user / account ------------------------------------------------

export const getCurrentUser = (): CurrentUser => state.currentUser

export const updateCurrentUser = (payload: ProfileUpdate): CurrentUser => {
    state.currentUser = { ...state.currentUser, ...payload }
    return state.currentUser
}

export const changePassword = (_payload: PasswordChange): void => {
    // No-op: nothing to persist against in mock mode, matches the real
    // endpoint's 204-no-body response.
}

// --- Notifications -----------------------------------------------------------

export const listNotifications = (): Notification[] =>
    [...state.notifications].sort((a, b) => b.created_at.localeCompare(a.created_at))

export const getUnreadCount = (): number => state.notifications.filter((n) => !n.is_read).length

export const markNotificationRead = (id: number): void => {
    const notification = state.notifications.find((n) => n.id === id)
    if (notification) notification.is_read = true
}

export const markAllNotificationsRead = (): void => {
    state.notifications.forEach((n) => (n.is_read = true))
}

// --- Notification preferences -------------------------------------------------

export const getPreferences = (): NotificationPreference => state.preferences

export const updatePreferences = (patch: Partial<NotificationPreference>): NotificationPreference => {
    state.preferences = { ...state.preferences, ...patch }
    return state.preferences
}

// --- Push devices --------------------------------------------------------------

export const registerDevice = (token: string, platform: Device['platform']): Device => {
    const existing = state.devices.find((d) => d.token === token)
    if (existing) {
        existing.is_active = true
        return existing
    }
    const device: Device = { id: nextId(), token, platform, is_active: true, created_at: new Date().toISOString() }
    state.devices.push(device)
    return device
}

export const unregisterDevice = (id: number): void => {
    state.devices = state.devices.filter((d) => d.id !== id)
}

export const listDevices = (): Device[] => state.devices

// --- Barangay subscriptions ----------------------------------------------------

export const listSubscriptions = (): Subscription[] => state.subscriptions

/** Idempotent, mirroring the real endpoint's get_or_create: re-subscribing is a no-op. */
export const createSubscription = (barangay: number, barangayName: string): Subscription => {
    const existing = state.subscriptions.find((s) => s.barangay === barangay)
    if (existing) return existing
    const subscription: Subscription = {
        id: nextId(),
        barangay,
        barangay_name: barangayName,
        created_at: new Date().toISOString(),
    }
    state.subscriptions.push(subscription)
    return subscription
}

export const deleteSubscription = (id: number): void => {
    state.subscriptions = state.subscriptions.filter((s) => s.id !== id)
}
