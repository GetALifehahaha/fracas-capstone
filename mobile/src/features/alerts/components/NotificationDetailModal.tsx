import { useEffect } from 'react'
import { Modal, ScrollView, StyleSheet, View } from 'react-native'

import { spacing, useTheme } from '@/common/theme'
import { Badge, Button, Card, Text } from '@/common/ui'
import { timeAgo } from '@/common/utils/time'

import { CATEGORY_LABELS, RISK_COLORS, categoryTextColor } from '../constants'
import { useMarkRead } from '../hooks/useNotificationMutations'
import type { Notification } from '../types'

interface Props {
    notification: Notification | null
    onClose: () => void
}

/** Full notification detail as a slide-up sheet. Marks the alert read on open. */
export function NotificationDetailModal({ notification, onClose }: Props) {
    const theme = useTheme()
    const markRead = useMarkRead()

    useEffect(() => {
        if (notification && !notification.is_read) markRead.mutate(notification.id)
        // Mark once per opened notification; the mutation itself is stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notification?.id])

    return (
        <Modal
            visible={notification != null}
            animationType="slide"
            onRequestClose={onClose}
            presentationStyle="pageSheet"
        >
            <View style={[styles.sheet, { backgroundColor: theme.colors.bg }]}>
                <View style={styles.header}>
                    <Text variant="title" style={styles.title}>
                        Alert
                    </Text>
                    <Button label="Close" variant="ghost" onPress={onClose} style={styles.close} />
                </View>

                {notification ? (
                    <ScrollView contentContainerStyle={styles.body}>
                        <View style={styles.meta}>
                            <Badge
                                label={CATEGORY_LABELS[notification.category]}
                                color={RISK_COLORS[notification.category]}
                                textColor={categoryTextColor(notification.category)}
                            />
                            <Text variant="caption" color="textMuted">
                                {timeAgo(notification.created_at)}
                            </Text>
                        </View>

                        <Text variant="subtitle">{notification.title}</Text>
                        {notification.barangay_name ? (
                            <Text variant="caption" color="textMuted">
                                {notification.barangay_name}
                            </Text>
                        ) : null}

                        <Card>
                            <Text variant="body">{notification.body}</Text>
                        </Card>
                    </ScrollView>
                ) : null}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    sheet: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },
    title: { flexShrink: 1 },
    close: { minHeight: 40, paddingHorizontal: spacing.md },
    body: { padding: spacing.lg, gap: spacing.md },
    meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
})
