/** Branch ui-build runs with no backend — served from an in-memory mock db. */
import type {
    FloodEvent,
    FloodEventChange,
    FloodEventDetail,
    FloodEventFilters,
    FloodEventInput,
    FloodEventReport,
    Operator,
    Paginated,
} from '../types/api'
import operatorsFixture from '@/mocks/fixtures/operators'
import * as db from '@/mocks/db'
import { delay, paginate } from '@/mocks/utils'

export const getOperators = async (): Promise<Operator[]> => {
    await delay()
    return operatorsFixture
}

export const getFloodEvents = async (
    filters: FloodEventFilters = {},
): Promise<Paginated<FloodEvent>> => {
    await delay()
    return paginate(db.listFloodEvents(filters), filters.page)
}

export const getFloodEvent = async (id: number): Promise<FloodEventDetail> => {
    await delay()
    const event = db.getFloodEvent(id)
    if (!event) throw new Error(`Flood event ${id} not found`)
    return event
}

export const createFloodEvent = async (payload: FloodEventInput): Promise<FloodEvent> => {
    await delay(400)
    return db.createFloodEvent(payload)
}

export const updateFloodEvent = async (
    id: number,
    payload: FloodEventInput,
): Promise<FloodEvent> => {
    await delay(400)
    return db.updateFloodEvent(id, payload)
}

export const deleteFloodEvent = async (id: number): Promise<void> => {
    await delay(300)
    db.deleteFloodEvent(id)
}

export const getFloodEventChanges = async (id: number): Promise<FloodEventChange[]> => {
    await delay()
    return db.listFloodEventChanges(id)
}

export const confirmFloodEvent = async (id: number): Promise<FloodEventDetail> => {
    await delay(300)
    return db.confirmFloodEvent(id)
}

export const resolveFloodEvent = async (
    id: number,
    endedAt: string,
): Promise<FloodEventDetail> => {
    await delay(300)
    return db.resolveFloodEvent(id, endedAt)
}

export const restoreFloodEvent = async (id: number): Promise<FloodEventDetail> => {
    await delay(300)
    return db.restoreFloodEvent(id)
}

export const getFloodEventReports = async (
    id: number,
): Promise<Paginated<FloodEventReport>> => {
    await delay()
    return paginate(db.listFloodEventReports(id))
}

export const createFloodEventReport = async (
    id: number,
    form: FormData,
): Promise<FloodEventReport> => {
    await delay(500)
    const description = String(form.get('description') ?? '')
    const occurredAt = String(form.get('occurred_at') ?? new Date().toISOString())
    const imageCount = form.getAll('uploaded_images').length
    return db.createFloodEventReport(id, description, occurredAt, imageCount)
}
