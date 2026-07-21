/** Branch ui-build runs with no backend — served from an in-memory mock db. */
import type { AutoDetectConfig, SystemStatus } from '../types/system'
import * as db from '@/mocks/db'
import { delay } from '@/mocks/utils'

export const getSystemStatus = async (): Promise<SystemStatus> => {
    await delay()
    return db.getSystemStatus()
}

export const runPipeline = async (): Promise<{ detail: string }> => {
    await delay(600)
    return { detail: 'Pipeline run queued.' }
}

export const runRetention = async (): Promise<{ detail: string }> => {
    await delay(600)
    return { detail: 'Retention cleanup queued.' }
}

export const getAutoDetectConfig = async (): Promise<AutoDetectConfig> => {
    await delay()
    return db.getAutoDetectConfig()
}

export const updateAutoDetectConfig = async (
    payload: Partial<AutoDetectConfig>,
): Promise<AutoDetectConfig> => {
    await delay(400)
    return db.updateAutoDetectConfig(payload)
}
