/** Branch ui-build runs with no backend — served from an in-memory mock db. */
import type { Paginated } from '@/features/user/types'
import type {
    CreateRiskConfigPayload,
    RiskConfig,
    UpdateRiskConfigPayload,
    ValidationRun,
} from '../types/model'
import * as db from '@/mocks/db'
import { delay, paginate } from '@/mocks/utils'

export const getRiskConfigs = async (): Promise<Paginated<RiskConfig>> => {
    await delay()
    return paginate(db.listRiskConfigs())
}

export const createRiskConfig = async (payload: CreateRiskConfigPayload): Promise<RiskConfig> => {
    await delay(400)
    return db.createRiskConfig(payload)
}

export const updateRiskConfig = async (
    id: number,
    payload: UpdateRiskConfigPayload,
): Promise<RiskConfig> => {
    await delay(400)
    return db.updateRiskConfig(id, payload)
}

export const activateRiskConfig = async (id: number): Promise<RiskConfig> => {
    await delay(400)
    return db.activateRiskConfig(id)
}

export const getValidationRuns = async (page = 1): Promise<Paginated<ValidationRun>> => {
    await delay()
    return paginate(db.listValidationRuns(), page)
}

export const getValidationRun = async (id: number): Promise<ValidationRun> => {
    await delay()
    const run = db.getValidationRun(id)
    if (!run) throw new Error(`Validation run ${id} not found`)
    return run
}

export const createValidationRun = async (): Promise<ValidationRun> => {
    await delay(300)
    return db.createValidationRun()
}
