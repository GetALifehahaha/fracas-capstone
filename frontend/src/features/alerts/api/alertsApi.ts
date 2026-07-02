import apiClient from '@/app/apiClient'
import type {
    AlertEvent,
    AlertEventFilters,
    BroadcastPayload,
    BroadcastResult,
    Paginated,
} from '../types/api'

/** Operator audit log: system-wide alert transitions, paginated + filterable. */
export const getAlertEvents = async (
    filters: AlertEventFilters = {},
): Promise<Paginated<AlertEvent>> => {
    const { data } = await apiClient.get<Paginated<AlertEvent>>('/api/alerts/events/', {
        params: filters,
    })
    return data
}

/** Push a manual advisory to a barangay's subscribers. */
export const postBroadcast = async (
    payload: BroadcastPayload,
): Promise<BroadcastResult> => {
    const { data } = await apiClient.post<BroadcastResult>('/api/admin/broadcasts/', payload)
    return data
}
