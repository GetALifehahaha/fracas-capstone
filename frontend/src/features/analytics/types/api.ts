import type { RiskCategory } from '@/features/gis/types/api'

/** Flood severity as recorded on a FloodEvent. */
export type FloodSeverity = 'minor' | 'moderate' | 'major'

/** Look-back window (days) shared by every analytics query. */
export type AnalyticsWindow = 7 | 30 | 90

// --- GET /api/analytics/summary/ ---------------------------------------
export interface DamSnapshot {
    name: string
    water_level: number
    normal_level: number
    critical_level: number
    /** 0-100: how far the level sits between normal and critical (null if unconfigured). */
    pct_to_critical: number | null
    is_spilling: boolean
    recorded_at: string
}

export interface ValidationSnapshot {
    recall: number | null
    mean_score: number | null
    events_evaluated: number
    created_at: string
}

export interface AnalyticsSummary {
    flood_events: number
    people_affected: number
    people_evacuated: number
    barangays_critical: number
    barangays_high: number
    dam: DamSnapshot | null
    validation: ValidationSnapshot | null
}

// --- GET /api/analytics/hotspots/ --------------------------------------
export interface Hotspot {
    barangay_id: number
    barangay_name: string
    is_downstream: boolean
    flood_susceptibility: number | null
    critical_cycles: number
    high_cycles: number
    flood_count: number
    people_affected: number
}

// --- GET /api/analytics/rainfall-timeline/ -----------------------------
export interface RainfallBucket {
    bucket: string
    avg_24h: number | null
    max_24h: number | null
}

export interface RainfallFloodMarker {
    occurred_at: string
    severity: FloodSeverity
    barangay: string
}

export interface RainfallTimeline {
    granularity: 'hour' | 'day'
    series: RainfallBucket[]
    events: RainfallFloodMarker[]
}

// --- GET /api/analytics/dam-timeline/ ----------------------------------
export interface DamReadingPoint {
    recorded_at: string
    water_level: number
    turbidity: number | null
    is_spilling: boolean
}

export interface DamTimeline {
    dam: { name: string; normal_level: number; critical_level: number } | null
    series: DamReadingPoint[]
    spilling: DamReadingPoint[]
}

// --- GET /api/analytics/model-performance/ -----------------------------
export interface ValidationRunPoint {
    created_at: string
    recall: number | null
    mean_score: number | null
    events_evaluated: number
    hits: number
}

/** Category counts feed the hotspot bars; re-exported for convenience. */
export type { RiskCategory }
