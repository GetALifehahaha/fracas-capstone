/** In-memory mock "database" for branch ui-build (no backend). Seeded from
 * fixtures/*, mutated in place so create/update/delete actions feel real
 * within a session; resets on page reload. */
import type { Role } from '@/common/types/Role'
import type {
    FloodEvent,
    FloodEventChange,
    FloodEventDetail,
    FloodEventFilters,
    FloodEventInput,
    FloodEventReport,
} from '@/features/history/types/api'
import type { AlertEvent, AlertEventFilters, BroadcastPayload } from '@/features/alerts/types/api'
import type { AdminUser, AdminUserFilters, CreateUserPayload, UpdateUserPayload } from '@/features/admin/types/user'
import type { CreateRiskConfigPayload, RiskConfig, UpdateRiskConfigPayload, ValidationRun } from '@/features/admin/types/model'
import type { SettingsByGroup, SettingsGroup } from '@/features/admin/types/settings'
import type { AutoDetectConfig } from '@/features/admin/types/system'
import type { AccountChange, CurrentUser, FloodActivity } from '@/features/user/types'
import type { PoiKind, PoiLog } from '@/features/gis/poi/types'

import floodEventsFixture from './fixtures/floodEvents'
import floodEventChangesFixture from './fixtures/floodEventChanges'
import alertEventsFixture from './fixtures/alertEvents'
import adminUsersFixture from './fixtures/adminUsers'
import riskConfigsFixture from './fixtures/riskConfigs'
import settingsFixture from './fixtures/settings'
import { systemStatusTemplate, autoDetectConfigFixture } from './fixtures/systemStatus'
import currentUserFixture from './fixtures/currentUser'
import accountChangesFixture from './fixtures/accountChanges'
import myActivityFixture from './fixtures/myActivity'
import poiLogsFixture from './fixtures/poiLogs'
import validationRunsFixture from './fixtures/validationRuns'
import { nextId } from './utils'

const clone = <T>(value: T): T => structuredClone(value)

const state = {
    floodEvents: clone(floodEventsFixture),
    floodEventChanges: clone(floodEventChangesFixture) as Record<number, FloodEventChange[]>,
    floodEventReports: {} as Record<number, FloodEventReport[]>,
    alertEvents: clone(alertEventsFixture),
    adminUsers: clone(adminUsersFixture),
    riskConfigs: clone(riskConfigsFixture),
    settings: clone(settingsFixture),
    autoDetectConfig: clone(autoDetectConfigFixture),
    accountChanges: clone(accountChangesFixture),
    myActivity: clone(myActivityFixture),
    poiLogs: clone(poiLogsFixture),
    validationRuns: clone(validationRunsFixture),
    /** started-at (ms epoch) per validation run created this session, used to
     * derive a pending -> running -> done status purely from elapsed time. */
    runStartedAt: {} as Record<number, number>,
    currentUser: clone(currentUserFixture.resident),
}

/** Swaps the "logged-in user" profile to match the demo role that just signed in. */
export const setCurrentUserRole = (role: Role): void => {
    state.currentUser = clone(currentUserFixture[role])
}

export const getCurrentUser = (): CurrentUser => state.currentUser
export const updateCurrentUser = (patch: Partial<CurrentUser>): CurrentUser => {
    state.currentUser = { ...state.currentUser, ...patch }
    return state.currentUser
}

// --- Flood events ----------------------------------------------------------

const toListShape = (e: FloodEventDetail): FloodEvent => ({
    id: e.id,
    barangay: e.barangay,
    barangay_name: e.barangay_name,
    occurred_at: e.occurred_at,
    ended_at: e.ended_at,
    severity: e.severity,
    water_depth_m: e.water_depth_m,
    source: e.source,
    source_type: e.source_type,
    reported_by_name: e.reported_by_name,
    notes: e.notes,
    source_kind: e.source_kind,
    is_confirmed: e.is_confirmed,
    confirmed_by_name: e.confirmed_by_name,
    is_resolved: e.is_resolved,
})

export const listFloodEvents = (filters: FloodEventFilters = {}): FloodEvent[] =>
    state.floodEvents
        .filter((e) => e.deleted_at === null)
        .filter((e) => (filters.barangay ? e.barangay === filters.barangay : true))
        .filter((e) => (filters.severity ? e.severity === filters.severity : true))
        .filter((e) => (filters.occurred_after ? e.occurred_at >= filters.occurred_after : true))
        .filter((e) => (filters.occurred_before ? e.occurred_at <= filters.occurred_before : true))
        .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at))
        .map(toListShape)

export const getFloodEvent = (id: number): FloodEventDetail | undefined =>
    state.floodEvents.find((e) => e.id === id)

const addFloodEventChange = (id: number, change: Omit<FloodEventChange, 'id'>): void => {
    const existing = state.floodEventChanges[id] ?? []
    state.floodEventChanges[id] = [{ id: nextId(), ...change }, ...existing]
}

export const createFloodEvent = (input: FloodEventInput): FloodEvent => {
    const now = new Date().toISOString()
    const barangayName =
        state.floodEvents.find((e) => e.barangay === input.barangay)?.barangay_name ?? `Barangay ${input.barangay}`
    const event: FloodEventDetail = {
        id: nextId(),
        barangay: input.barangay,
        barangay_name: barangayName,
        occurred_at: input.occurred_at,
        ended_at: input.ended_at ?? null,
        duration_hours: null,
        is_resolved: false,
        severity: input.severity,
        water_depth_m: input.water_depth_m ?? null,
        source: input.source ?? 'Manual entry',
        source_type: input.source_type,
        reported_by: input.reported_by ?? null,
        reported_by_name: null,
        notes: input.notes ?? '',
        source_kind: 'manual',
        is_confirmed: true,
        confirmed_by_name: state.currentUser.first_name || state.currentUser.username,
        confirmed_at: now,
        deleted_at: null,
        summary: input.summary ?? '',
        people_affected: input.people_affected ?? null,
        people_evacuated: input.people_evacuated ?? null,
        timeline: input.timeline.map((t) => ({ id: nextId(), occurred_at: t.occurred_at, title: t.title, description: t.description ?? '' })),
        telemetry: { window_hours: 6, rainfall: null, risk: null, location: [122.08, 6.92] },
    }
    state.floodEvents.unshift(event)
    addFloodEventChange(event.id, { editor_name: state.currentUser.first_name || state.currentUser.username, action: 'created', field: '', old_value: '', new_value: '', changed_at: now })
    return toListShape(event)
}

export const updateFloodEvent = (id: number, input: FloodEventInput): FloodEvent => {
    const event = state.floodEvents.find((e) => e.id === id)
    if (!event) throw new Error(`Flood event ${id} not found`)
    Object.assign(event, {
        barangay: input.barangay,
        occurred_at: input.occurred_at,
        ended_at: input.ended_at ?? event.ended_at,
        severity: input.severity,
        water_depth_m: input.water_depth_m ?? event.water_depth_m,
        summary: input.summary ?? event.summary,
        people_affected: input.people_affected ?? event.people_affected,
        people_evacuated: input.people_evacuated ?? event.people_evacuated,
        source: input.source ?? event.source,
        source_type: input.source_type,
        notes: input.notes ?? event.notes,
        timeline: input.timeline.map((t) => ({ id: nextId(), occurred_at: t.occurred_at, title: t.title, description: t.description ?? '' })),
    })
    addFloodEventChange(id, { editor_name: state.currentUser.first_name || state.currentUser.username, action: 'updated', field: 'occurred_at', old_value: '', new_value: input.occurred_at, changed_at: new Date().toISOString() })
    return toListShape(event)
}

export const deleteFloodEvent = (id: number): void => {
    const event = state.floodEvents.find((e) => e.id === id)
    if (!event) return
    event.deleted_at = new Date().toISOString()
    addFloodEventChange(id, { editor_name: state.currentUser.first_name || state.currentUser.username, action: 'deleted', field: '', old_value: '', new_value: '', changed_at: event.deleted_at })
}

export const restoreFloodEvent = (id: number): FloodEventDetail => {
    const event = state.floodEvents.find((e) => e.id === id)
    if (!event) throw new Error(`Flood event ${id} not found`)
    event.deleted_at = null
    addFloodEventChange(id, { editor_name: state.currentUser.first_name || state.currentUser.username, action: 'restored', field: '', old_value: '', new_value: '', changed_at: new Date().toISOString() })
    return event
}

export const confirmFloodEvent = (id: number): FloodEventDetail => {
    const event = state.floodEvents.find((e) => e.id === id)
    if (!event) throw new Error(`Flood event ${id} not found`)
    event.is_confirmed = true
    event.confirmed_by_name = state.currentUser.first_name || state.currentUser.username
    event.confirmed_at = new Date().toISOString()
    addFloodEventChange(id, { editor_name: event.confirmed_by_name, action: 'confirmed', field: '', old_value: '', new_value: '', changed_at: event.confirmed_at })
    return event
}

export const resolveFloodEvent = (id: number, endedAt: string): FloodEventDetail => {
    const event = state.floodEvents.find((e) => e.id === id)
    if (!event) throw new Error(`Flood event ${id} not found`)
    event.ended_at = endedAt
    event.is_resolved = true
    event.duration_hours = (new Date(endedAt).getTime() - new Date(event.occurred_at).getTime()) / 3_600_000
    addFloodEventChange(id, { editor_name: state.currentUser.first_name || state.currentUser.username, action: 'resolved', field: 'ended_at', old_value: '', new_value: endedAt, changed_at: new Date().toISOString() })
    return event
}

export const listFloodEventChanges = (id: number): FloodEventChange[] => state.floodEventChanges[id] ?? []

export const listFloodEventReports = (id: number): FloodEventReport[] => state.floodEventReports[id] ?? []

export const createFloodEventReport = (id: number, description: string, occurredAt: string, imageCount: number): FloodEventReport => {
    const report: FloodEventReport = {
        id: nextId(),
        flood_event: id,
        reporter: state.currentUser.id,
        reporter_name: state.currentUser.first_name || state.currentUser.username,
        description,
        occurred_at: occurredAt,
        created_at: new Date().toISOString(),
        images: Array.from({ length: Math.max(imageCount, 1) }, () => ({
            id: nextId(),
            image: '/mock-data/placeholder-report.svg',
            caption: '',
            uploaded_at: new Date().toISOString(),
        })).slice(0, imageCount || 1),
    }
    state.floodEventReports[id] = [report, ...(state.floodEventReports[id] ?? [])]
    return report
}

export const listMyActivity = (): FloodActivity[] => state.myActivity

// --- Alert events ------------------------------------------------------------

export const listAlertEvents = (filters: AlertEventFilters = {}): AlertEvent[] =>
    state.alertEvents
        .filter((e) => (filters.barangay ? e.barangay === filters.barangay : true))
        .filter((e) => (filters.source ? e.source === filters.source : true))
        .filter((e) => (filters.kind ? e.kind === filters.kind : true))
        .filter((e) => (filters.triggered_by === 'me' ? e.triggered_by_username === state.currentUser.username : true))
        .sort((a, b) => b.created_at.localeCompare(a.created_at))

export const createBroadcast = (payload: BroadcastPayload): { recipients: number; dispatch_key: string } => {
    const barangayName =
        state.floodEvents.find((e) => e.barangay === payload.barangay)?.barangay_name ?? `Barangay ${payload.barangay}`
    const recipients = 10 + Math.floor(Math.random() * 150)
    state.alertEvents.unshift({
        id: nextId(),
        barangay: payload.barangay,
        barangay_name: barangayName,
        level: 'critical',
        kind: 'broadcast',
        source: 'operator',
        score: null,
        recipients,
        suppressed: false,
        triggered_by_username: state.currentUser.username,
        created_at: new Date().toISOString(),
    })
    return { recipients, dispatch_key: `mock-${nextId()}` }
}

// --- Admin: users ------------------------------------------------------------

export const listAdminUsers = (filters: AdminUserFilters = {}): AdminUser[] =>
    state.adminUsers
        .filter((u) => (filters.role ? u.role === filters.role : true))
        .filter((u) => (filters.is_active !== undefined ? u.is_active === filters.is_active : true))
        .filter((u) =>
            filters.search
                ? `${u.username} ${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(filters.search.toLowerCase())
                : true,
        )

export const getAdminUser = (id: number): AdminUser | undefined => state.adminUsers.find((u) => u.id === id)

export const createAdminUser = (payload: CreateUserPayload): AdminUser => {
    const user: AdminUser = {
        id: nextId(),
        username: payload.username,
        email: payload.email ?? '',
        first_name: payload.first_name ?? '',
        last_name: payload.last_name ?? '',
        phone_number: payload.phone_number ?? null,
        phone_verified: false,
        is_active: true,
        is_operator: payload.is_operator ?? false,
        is_staff: payload.is_staff ?? false,
        role: payload.is_staff ? 'admin' : payload.is_operator ? 'operator' : 'resident',
        date_joined: new Date().toISOString(),
        last_login: null,
    }
    state.adminUsers.unshift(user)
    return user
}

export const updateAdminUser = (id: number, payload: UpdateUserPayload): AdminUser => {
    const user = state.adminUsers.find((u) => u.id === id)
    if (!user) throw new Error(`Admin user ${id} not found`)
    Object.assign(user, payload)
    if (payload.is_staff !== undefined || payload.is_operator !== undefined) {
        user.role = user.is_staff ? 'admin' : user.is_operator ? 'operator' : 'resident'
    }
    return user
}

export const resetAdminUserPassword = (): { password: string } => ({
    password: `mock-${Math.random().toString(36).slice(2, 10)}`,
})

export const listAdminUserChanges = (): AccountChange[] => state.accountChanges

// --- Admin: risk configs -----------------------------------------------------

export const listRiskConfigs = (): RiskConfig[] => state.riskConfigs

export const createRiskConfig = (payload: CreateRiskConfigPayload): RiskConfig => {
    const config: RiskConfig = { id: nextId(), name: payload.name, is_active: false, weights: payload.weights, thresholds: payload.thresholds, created_at: new Date().toISOString() }
    state.riskConfigs.unshift(config)
    return config
}

export const updateRiskConfig = (id: number, payload: UpdateRiskConfigPayload): RiskConfig => {
    const config = state.riskConfigs.find((c) => c.id === id)
    if (!config) throw new Error(`Risk config ${id} not found`)
    Object.assign(config, payload)
    return config
}

export const activateRiskConfig = (id: number): RiskConfig => {
    state.riskConfigs.forEach((c) => (c.is_active = c.id === id))
    return state.riskConfigs.find((c) => c.id === id)!
}

// --- Admin: validation runs ---------------------------------------------------

const PENDING_MS = 3_000
const RUNNING_MS = 9_000

/** Runs created this session transition pending -> running -> done purely
 * based on elapsed wall-clock time, so the 3s-poll UX in useValidationRun(s)
 * looks real without a real Celery task behind it. */
const withLiveStatus = (run: ValidationRun): ValidationRun => {
    const startedAtMs = state.runStartedAt[run.id]
    if (startedAtMs === undefined) return run
    const elapsed = Date.now() - startedAtMs
    if (elapsed < PENDING_MS) return { ...run, status: 'pending', finished_at: null }
    if (elapsed < RUNNING_MS) return { ...run, status: 'running', finished_at: null }
    return { ...run, status: 'done', finished_at: new Date(startedAtMs + RUNNING_MS).toISOString() }
}

export const listValidationRuns = (): ValidationRun[] => state.validationRuns.map(withLiveStatus)
export const getValidationRun = (id: number): ValidationRun | undefined => {
    const run = state.validationRuns.find((r) => r.id === id)
    return run && withLiveStatus(run)
}

export const createValidationRun = (): ValidationRun => {
    const base = validationRunsFixture[0]
    const run: ValidationRun = { ...clone(base), id: nextId(), created_at: new Date().toISOString(), finished_at: null, status: 'pending' }
    state.validationRuns.unshift(run)
    state.runStartedAt[run.id] = Date.now()
    return withLiveStatus(run)
}

// --- Admin: settings -----------------------------------------------------------

export const getSettings = <G extends SettingsGroup>(group: G): SettingsByGroup[G] => state.settings[group]
export const updateSettings = <G extends SettingsGroup>(group: G, payload: Partial<SettingsByGroup[G]>): SettingsByGroup[G] => {
    state.settings[group] = { ...state.settings[group], ...payload, updated_at: new Date().toISOString() }
    return state.settings[group]
}

// --- Admin: system status + auto-detect ----------------------------------------

export const getSystemStatus = () => {
    const now = () => new Date().toISOString()
    return {
        ...clone(systemStatusTemplate),
        ingestion: { rainfall: { ...systemStatusTemplate.ingestion.rainfall, last_success_at: now() } },
        pipeline: {
            rainfall: { ...systemStatusTemplate.pipeline.rainfall, last_run: now() },
            scoring: { ...systemStatusTemplate.pipeline.scoring, last_run: now() },
            alerts: { ...systemStatusTemplate.pipeline.alerts, last_run: now() },
        },
    }
}

export const getAutoDetectConfig = (): AutoDetectConfig => state.autoDetectConfig
export const updateAutoDetectConfig = (payload: Partial<AutoDetectConfig>): AutoDetectConfig => {
    state.autoDetectConfig = { ...state.autoDetectConfig, ...payload, updated_at: new Date().toISOString() }
    return state.autoDetectConfig
}

// --- POI logs ------------------------------------------------------------------

export const listPoiLogs = (poiType?: PoiKind): PoiLog[] =>
    poiType ? state.poiLogs.filter((l) => l.poi_type === poiType) : state.poiLogs
