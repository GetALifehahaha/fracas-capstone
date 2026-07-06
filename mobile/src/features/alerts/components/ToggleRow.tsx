import { StyleSheet, Switch, View } from 'react-native'

import { spacing, useTheme } from '@/common/theme'
import { Text } from '@/common/ui'

interface Props {
    label: string
    description?: string
    value: boolean
    onValueChange: (value: boolean) => void
    disabled?: boolean
}

/** A labeled setting row with a trailing switch (channel opt-ins, subscription). */
export function ToggleRow({ label, description, value, onValueChange, disabled }: Props) {
    const theme = useTheme()
    return (
        <View style={[styles.row, disabled && styles.disabled]}>
            <View style={styles.copy}>
                <Text variant="label">{label}</Text>
                {description ? (
                    <Text variant="caption" color="textMuted">
                        {description}
                    </Text>
                ) : null}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
                thumbColor={theme.colors.onPrimary}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    disabled: { opacity: 0.5 },
    copy: { flex: 1, gap: spacing.xs },
})
