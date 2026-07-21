/** Branch ui-build runs with no backend — every call here is served from a
 * static fixture (real captured GeoJSON/scores) or an in-memory mock store. */
import type {
    BarangayFeatureCollection,
    BarangayRisk,
    HazardZoneCollection,
    RiskFactorBreakdown,
    RiskSnapshot,
} from '../types/api'
import barangaysFixture from '@/mocks/fixtures/barangays'
import riskSnapshotBarangaysFixture from '@/mocks/fixtures/riskSnapshot'
import { delay, seededRandom } from '@/mocks/utils'

export const getBarangays = async (): Promise<BarangayFeatureCollection> => {
    await delay()
    return barangaysFixture
}

export const getRiskSnapshot = async (): Promise<RiskSnapshot> => {
    await delay()
    return {
        computed_at: new Date().toISOString(),
        count: riskSnapshotBarangaysFixture.length,
        barangays: riskSnapshotBarangaysFixture,
    }
}

/** Procedurally derives a plausible full breakdown for any barangay from its
 * snapshot score, seeded by id so repeated calls are stable within a session.
 * Shape mirrors real captures from the live dev backend. */
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

let hazardZonesCache: HazardZoneCollection | null = null

/** The real susceptibility layer is ~7.6MB even simplified, so it's served as
 * a static asset (public/mock-data/hazardZones.json) and fetched once. */
export const getHazardZones = async (): Promise<HazardZoneCollection> => {
    if (hazardZonesCache) return hazardZonesCache
    const response = await fetch('/mock-data/hazardZones.json')
    hazardZonesCache = (await response.json()) as HazardZoneCollection
    return hazardZonesCache
}
