/** Branch ui-build runs with no backend — served from an in-memory mock db. */
import type { SettingsByGroup, SettingsGroup } from '../types/settings'
import * as db from '@/mocks/db'
import { delay } from '@/mocks/utils'

export const getSettings = async <G extends SettingsGroup>(
    group: G,
): Promise<SettingsByGroup[G]> => {
    await delay()
    return db.getSettings(group)
}

export const updateSettings = async <G extends SettingsGroup>(
    group: G,
    payload: Partial<SettingsByGroup[G]>,
): Promise<SettingsByGroup[G]> => {
    await delay(400)
    return db.updateSettings(group, payload)
}
