/** Branch `ui-build` runs with no backend — every call here is served from a
 * static fixture (real captured GeoJSON/scores) or procedurally derived from it. */
import barangaysFixture from '@/mocks/fixtures/barangays'
import evacuationCentersFixture from '@/mocks/fixtures/evacuationCenters'
import riskSnapshotBarangaysFixture from '@/mocks/fixtures/riskSnapshot'
import { delay, seededRandom } from '@/mocks/utils'

import type {
    BarangayFeatureCollection,
    BarangayRisk,
    DamStatus,
    EvacuationCenterCollection,
    RiskFactorBreakdown,
    RiskSnapshot,
} from '../types'

/** Barangay geometries (server-cached ~15 min). Static; join risk on top. */
export const getBarangays = async (): Promise<BarangayFeatureCollection> => {
    await delay()
    return barangaysFixture
}

/** Latest risk category/score for every barangay in one read. */
export const getRiskSnapshot = async (): Promise<RiskSnapshot> => {
    await delay()
    return {
        computed_at: new Date().toISOString(),
        count: riskSnapshotBarangaysFixture.length,
        barangays: riskSnapshotBarangaysFixture,
    }
}

/** Full explainable breakdown + rainfall for a single barangay. Procedurally
 * derives a plausible breakdown from the snapshot score, seeded by id so
 * repeated calls are stable within a session. Shape mirrors real captures
 * from the live dev backend (same approach as the web mock). */
export const getBarangayRisk = async (id: number): Promise<BarangayRisk> => {
    await delay()
    const entry = riskSnapshotBarangaysFixture.find((b) => b.id === id)
    if (!entry) throw new Error(`Unknown barangay ${id}`)

    const r1 = seededRandom(id * 7 + 1)
    const r2 = seededRandom(id * 7 + 2)
    const rainfallValue = Math.round(((entry.score / 100) * 0.08 + r1 * 0.02) * 10000) / 10000
    const accumulated = Math.round((entry.score / 100) * 20 * 10) / 10

    const susceptibilityDetail: RiskFactorBreakdown['detail'] = {
        levels: {
            moderate: { share: 0.15, area_sqm: 150_000 },
            high: { share: 0.35, area_sqm: 350_000 },
            very_high: { share: 0.5, area_sqm: 500_000 },
        },
        zone_count: 3,
        dominant_level: entry.score >= 75 ? 'very_high' : entry.score >= 50 ? 'high' : 'moderate',
    }

    return {
        id: entry.id,
        name: entry.name,
        status: entry.category,
        risk_score: entry.score,
        is_degraded: entry.is_degraded,
        breakdown: {
            rainfall: {
                value: rainfallValue,
                detail: {
                    intensity_hazard: Math.round(r1 * 100) / 1000,
                    saturation_hazard: Math.round(rainfallValue * 100) / 100,
                    accumulated_24hr_mm: accumulated,
                    peak_intensity_mm_hr: Math.round(r2 * 5 * 10) / 10,
                },
                available: true,
                raw_weight: 0.5,
            },
            susceptibility: {
                value: 1.0,
                detail: susceptibilityDetail,
                available: true,
                raw_weight: 0.5,
            },
        },
        computed_at: new Date().toISOString(),
        current_rainfall: Math.round(r2 * 3 * 10) / 10,
        rainfall_forecast_1hr: Math.round(r1 * 2 * 10) / 10,
        rainfall_forecast_2hr: Math.round(r2 * 1.5 * 10) / 10,
        rainfall_forecast_3hr: Math.round(r1 * 1 * 10) / 10,
        rainfall_forecast_4hr: Math.round(r2 * 0.5 * 10) / 10,
        accumulated_24hr: accumulated,
        rainfall_rate_change: null,
        recorded_at: new Date(Date.now() - 15 * 60_000).toISOString(),
    }
}

/** Current Pasonanca dam reading vs thresholds. No consuming hook today — kept
 * as a simple static, plausible reading. */
export const getDamStatus = async (): Promise<DamStatus> => {
    await delay()
    return {
        has_data: true,
        dam: 'Pasonanca Dam',
        normal_level: 42,
        critical_level: 48,
        current_level: 43.2,
        rate_of_change: 0.05,
        is_spilling: false,
        turbidity: 12.4,
        recorded_at: new Date(Date.now() - 15 * 60_000).toISOString(),
    }
}

/** All active evacuation centers as GeoJSON Points (server-cached ~15 min). */
export const getEvacuationCenters = async (): Promise<EvacuationCenterCollection> => {
    await delay()
    return evacuationCentersFixture
}
