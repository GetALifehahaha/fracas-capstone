import { Pressable, StyleSheet, View } from 'react-native'

import { radius, spacing, useTheme } from '@/common/theme'
import { Badge, Text } from '@/common/ui'
import { timeAgo } from '@/common/utils/time'

import { CATEGORY_LABELS, RISK_COLORS, categoryTextColor } from '../constants'
import type { Notification } from '../types'

interface Props {
    notification: Notification
    onPress: (notification: Notification) => void
}

/** One notification in the feed: unread dot, severity badge, title + preview. */
export function NotificationRow({ notification, onPress }: Props) {
    const theme = useTheme()
    const { category, title, body, barangay_name, created_at, is_read } = notification

    return (
        <Pressable
            onPress={() => onPress(notification)}
            style={({ pressed }) => [
                styles.row,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.dotColumn}>
                <View
                    style={[
                        styles.dot,
                        { backgroundColor: is_read ? 'transparent' : theme.colors.primary },
                    ]}
                />
            </View>

            <View style={styles.content}>
                <View style={styles.headline}>
                    <Badge
                        label={CATEGORY_LABELS[category]}
                        color={RISK_COLORS[category]}
                        textColor={categoryTextColor(category)}
                    />
                    <Text variant="caption" color="textMuted">
                        {timeAgo(created_at)}
                    </Text>
                </View>

                <Text variant="label" style={is_read ? styles.readTitle : undefined} numberOfLines={2}>
                    {title}
                </Text>
                <Text variant="caption" color="textMuted" numberOfLines={2}>
                    {body}
                </Text>
                {barangay_name ? (
                    <Text variant="caption" color="textMuted">
                        {barangay_name}
                    </Text>
                ) : null}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: spacing.sm,
        padding: spacing.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: radius.lg,
    },
    pressed: { opacity: 0.7 },
    dotColumn: { width: 10, paddingTop: spacing.xs },
    dot: { width: 8, height: 8, borderRadius: 4 },
    content: { flex: 1, gap: spacing.xs },
    headline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    readTitle: { fontWeight: '400' },
})
