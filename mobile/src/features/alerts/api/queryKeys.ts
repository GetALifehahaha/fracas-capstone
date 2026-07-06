/** Centralized alert query keys — one place to invalidate/prefetch from. */
export const alertKeys = {
    notifications: ['alerts', 'notifications'] as const,
    unreadCount: ['alerts', 'unread-count'] as const,
    preferences: ['alerts', 'preferences'] as const,
    subscriptions: ['alerts', 'subscriptions'] as const,
    devices: ['alerts', 'devices'] as const,
}
