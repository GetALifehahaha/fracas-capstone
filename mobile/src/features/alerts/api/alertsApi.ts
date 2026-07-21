/** Branch `ui-build` runs with no backend — reads/writes hit the in-memory mock db. */
import * as db from '@/mocks/db'
import barangaysFixture from '@/mocks/fixtures/barangays'
import { delay, paginate } from '@/mocks/utils'

import type {
    Device,
    Notification,
    NotificationPreference,
    Paginated,
    Subscription,
} from '../types'

// --- In-app notifications feed -------------------------------------------------

/** One page of the resident's notifications (newest first, size 25). */
export const getNotifications = async (page = 1): Promise<Paginated<Notification>> => {
    await delay()
    return paginate(db.listNotifications(), page)
}

/** Unread tally for the tab badge / bell — cheaper than fetching a page. */
export const getUnreadCount = async (): Promise<number> => {
    await delay()
    return db.getUnreadCount()
}

export const markNotificationRead = async (id: number): Promise<void> => {
    await delay()
    db.markNotificationRead(id)
}

export const markAllNotificationsRead = async (): Promise<void> => {
    await delay()
    db.markAllNotificationsRead()
}

// --- Delivery preferences ------------------------------------------------------

export const getPreferences = async (): Promise<NotificationPreference> => {
    await delay()
    return db.getPreferences()
}

export const updatePreferences = async (
    patch: Partial<NotificationPreference>,
): Promise<NotificationPreference> => {
    await delay()
    return db.updatePreferences(patch)
}

// --- Push devices --------------------------------------------------------------

export const registerDevice = async (
    token: string,
    platform: Device['platform'],
): Promise<Device> => {
    await delay()
    return db.registerDevice(token, platform)
}

export const unregisterDevice = async (id: number): Promise<void> => {
    await delay()
    db.unregisterDevice(id)
}

export const getDevices = async (): Promise<Device[]> => {
    await delay()
    return db.listDevices()
}

// --- Barangay subscriptions (who a fan-out reaches) ----------------------------

export const getSubscriptions = async (): Promise<Subscription[]> => {
    await delay()
    return db.listSubscriptions()
}

/** Idempotent server-side (get_or_create): re-subscribing is a no-op. */
export const subscribe = async (barangay: number): Promise<Subscription> => {
    await delay()
    const name = barangaysFixture.features.find((f) => f.properties.id === barangay)?.properties.name
    return db.createSubscription(barangay, name ?? `Barangay ${barangay}`)
}

export const unsubscribe = async (id: number): Promise<void> => {
    await delay()
    db.deleteSubscription(id)
}
