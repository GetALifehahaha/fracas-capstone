import apiClient from '@/app/apiClient'
import type {
    AutoDetectConfig,
    FloodEvent,
    FloodEventChange,
    FloodEventDetail,
    FloodEventFilters,
    FloodEventInput,
    Operator,
    Paginated,
} from '../types/api'

/** Operators + admins as {id, name}, for the report-source picker (unpaginated). */
export const getOperators = async (): Promise<Operator[]> => {
    const { data } = await apiClient.get<Operator[]>('/api/operators/')
    return data
}

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

/** Soft-delete a flood event (operator-only); recoverable via restore for 6h. */
export const deleteFloodEvent = async (id: number): Promise<void> => {
    await apiClient.delete(`/api/flood-events/${id}/`)
}

/** Audit trail (append-only) for one event. */
export const getFloodEventChanges = async (id: number): Promise<FloodEventChange[]> => {
    const { data } = await apiClient.get<FloodEventChange[]>(`/api/flood-events/${id}/changes/`)
    return data
}

/** Confirm an (auto-drafted) event, recording the confirming operator. */
export const confirmFloodEvent = async (id: number): Promise<FloodEventDetail> => {
    const { data } = await apiClient.post<FloodEventDetail>(`/api/flood-events/${id}/confirm/`)
    return data
}

/** Resolve an event by setting its end time. */
export const resolveFloodEvent = async (
    id: number,
    endedAt: string,
): Promise<FloodEventDetail> => {
    const { data } = await apiClient.post<FloodEventDetail>(`/api/flood-events/${id}/resolve/`, {
        ended_at: endedAt,
    })
    return data
}

/** Undo a soft-delete within the recovery window. */
export const restoreFloodEvent = async (id: number): Promise<FloodEventDetail> => {
    const { data } = await apiClient.post<FloodEventDetail>(`/api/flood-events/${id}/restore/`)
    return data
}

/** Read the auto-detection config singleton (admin-only). */
export const getAutoDetectConfig = async (): Promise<AutoDetectConfig> => {
    const { data } = await apiClient.get<AutoDetectConfig>('/api/flood-events/auto-detect-config/')
    return data
}

/** Update the auto-detection config (admin-only). */
export const updateAutoDetectConfig = async (
    payload: Partial<Pick<AutoDetectConfig, 'enabled' | 'threshold_category'>>,
): Promise<AutoDetectConfig> => {
    const { data } = await apiClient.patch<AutoDetectConfig>(
        '/api/flood-events/auto-detect-config/',
        payload,
    )
    return data
}
