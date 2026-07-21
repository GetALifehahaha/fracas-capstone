/** Branch ui-build runs with no backend — served from an in-memory mock db. */
import type { AlertEventFilters, BroadcastPayload, BroadcastResult, Paginated, AlertEvent } from '../types/api'
import { listAlertEvents, createBroadcast } from '@/mocks/db'
import { delay, paginate } from '@/mocks/utils'

export const getAlertEvents = async (
    filters: AlertEventFilters = {},
): Promise<Paginated<AlertEvent>> => {
    await delay()
    return paginate(listAlertEvents(filters), filters.page)
}

export const postBroadcast = async (payload: BroadcastPayload): Promise<BroadcastResult> => {
    await delay(400)
    return createBroadcast(payload)
}
