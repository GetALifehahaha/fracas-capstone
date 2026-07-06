import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { spacing, useTheme } from '@/common/theme'
import { Button, Card, Screen, Text } from '@/common/ui'

import { unregisterPushDevice } from '@/features/alerts/hooks/usePushRegistration'
import { useAuth } from '@/features/auth/context/useAuth'

/**
 * Account tab. Profile details + preferences arrive in a later phase; for now it
 * surfaces the session and a sign-out. Logout flips auth state → the app group
 * guard redirects back to the login stack.
 */
export function AccountScreen() {
    const { logout } = useAuth()
    const theme = useTheme()
    const [signingOut, setSigningOut] = useState(false)

    const onSignOut = async () => {
        setSigningOut(true)
        try {
            await unregisterPushDevice() // stop pushes to this device before clearing the session
            await logout()
        } finally {
            setSigningOut(false)
        }
    }

    return (
        <Screen>
            <View style={styles.header}>
                <Text variant="title">Account</Text>
                <Text variant="body" color="textMuted">
                    Manage your profile, address, and alert preferences.
                </Text>
            </View>

            <Pressable
                onPress={() => router.navigate('/notification-settings')}
                style={({ pressed }) => pressed && styles.pressed}
            >
                <Card style={styles.linkCard}>
                    <View style={styles.linkCopy}>
                        <Text variant="label">Notification settings</Text>
                        <Text variant="caption" color="textMuted">
                            Channels, quiet hours, and which barangay alerts you get.
                        </Text>
                    </View>
                    <Text style={[styles.chevron, { color: theme.colors.textMuted }]}>›</Text>
                </Card>
            </Pressable>

            <Card style={styles.card}>
                <Text variant="label" color="textMuted">
                    Coming soon
                </Text>
                <Text variant="body">
                    Editing your profile and permanent address will live here.
                </Text>
            </Card>

            <View style={styles.footer}>
                <Button
                    label="Sign out"
                    variant="danger"
                    onPress={onSignOut}
                    loading={signingOut}
                />
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    header: { gap: spacing.xs, marginBottom: spacing.xl },
    linkCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    linkCopy: { flex: 1, gap: spacing.xs },
    chevron: { fontSize: 24 },
    pressed: { opacity: 0.7 },
    card: { gap: spacing.xs },
    footer: { marginTop: spacing.xxl },
})
