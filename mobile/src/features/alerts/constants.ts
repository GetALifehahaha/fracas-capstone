import { RISK_COLORS } from '@/common/theme'
import { CATEGORY_LABELS } from '@/features/gis/constants/risk'

import type { Channel } from './types'

/** Reuse the risk ramp + labels so a notification badge reads like the map. */
export { RISK_COLORS, CATEGORY_LABELS }

/** Dark text on the light end of the ramp, white on the dark end (matches web). */
export const categoryTextColor = (category: keyof typeof RISK_COLORS): string =>
    category === 'high' || category === 'critical' ? '#ffffff' : '#3f0a0a'

/** Copy for each delivery channel toggle on the settings screen. */
export const CHANNEL_META: Record<Channel, { label: string; description: string }> = {
    inapp: {
        label: 'In-app alerts',
        description: 'Show alerts inside the app and in your feed.',
    },
    push: {
        label: 'Push notifications',
        description: 'Get notified even when the app is closed.',
    },
    sms: {
        label: 'SMS text messages',
        description: 'Receive critical alerts by text (standard rates may apply).',
    },
}

/** Order channels are shown in — in-app first (always the baseline), then reach. */
export const CHANNEL_ORDER: Channel[] = ['inapp', 'push', 'sms']
