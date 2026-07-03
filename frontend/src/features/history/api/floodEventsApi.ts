import apiClient from '@/app/apiClient'
import type {
    FloodEvent,
    FloodEventDetail,
    FloodEventFilters,
    FloodEventInput,
    Paginated,
} from '../types/api'

/** Paginated, filterable flood-history list. */
export const getFloodEvents = async (
    filters: FloodEventFilters = {},
): Promise<Paginated<FloodEvent>> => {
    const { data } = await apiClient.get<Paginated<FloodEvent>>('/api/flood-events/', {
        params: filters,
    })
    return data
}

/** Full flood event: stored fields + response timeline + derived telemetry. */
export const getFloodEvent = async (id: number): Promise<FloodEventDetail> => {
    const { data } = await apiClient.get<FloodEventDetail>(`/api/flood-events/${id}/`)
    return data
}

/** Create a flood event (operator-only). */
export const createFloodEvent = async (payload: FloodEventInput): Promise<FloodEvent> => {
    const { data } = await apiClient.post<FloodEvent>('/api/flood-events/', payload)
    return data
}

/** Edit a flood event (operator-only). */
export const updateFloodEvent = async (
    id: number,
    payload: FloodEventInput,
): Promise<FloodEvent> => {
    const { data } = await apiClient.patch<FloodEvent>(`/api/flood-events/${id}/`, payload)
    return data
}

/** Delete a flood event (operator-only). */
export const deleteFloodEvent = async (id: number): Promise<void> => {
    await apiClient.delete(`/api/flood-events/${id}/`)
}
