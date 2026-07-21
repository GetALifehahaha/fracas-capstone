/** Summary + rainfall-timeline + model-performance fixtures for the Analytics
 * page. Summary/model-performance are captured from the live dev backend;
 * rainfall series are synthesized (the real dev capture only had a couple of
 * hours of ingested data) so the charts render a full-looking window. */
import type {
    AnalyticsSummary,
    AnalyticsWindow,
    RainfallTimeline,
    ValidationRunPoint,
} from '../../features/analytics/types/api'
import { seededRandom } from '../utils'

const VALIDATION = {
    recall: 0.7011494252873564,
    mean_score: 50.044022988505745,
    events_evaluated: 87,
    created_at: '2026-07-08T13:23:34.555935Z',
}

export const summaryFixture: Record<AnalyticsWindow, AnalyticsSummary> = {
    7: { flood_events: 0, people_affected: 0, people_evacuated: 0, barangays_critical: 0, barangays_high: 70, validation: VALIDATION },
    30: { flood_events: 3, people_affected: 307, people_evacuated: 48, barangays_critical: 2, barangays_high: 70, validation: VALIDATION },
    90: { flood_events: 6, people_affected: 312, people_evacuated: 48, barangays_critical: 2, barangays_high: 70, validation: VALIDATION },
}

/** Builds a plausible rolling-rainfall series ending "now", seeded so it's
 * stable within a session. `flood events` are marked where they overlap. */
const buildRainfallTimeline = (
    days: AnalyticsWindow,
    granularity: 'hour' | 'day',
): RainfallTimeline => {
    const buckets = granularity === 'hour' ? 24 : days
    const stepMs = granularity === 'hour' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    const now = Date.now()

    const series = Array.from({ length: buckets }, (_, i) => {
        const t = now - (buckets - 1 - i) * stepMs
        const jitter = seededRandom(days * 1000 + i)
        const avg = 2 + jitter * 12
        return {
            bucket: new Date(t).toISOString(),
            avg_24h: Math.round(avg * 100) / 100,
            max_24h: Math.round((avg + jitter * 15) * 100) / 100,
        }
    })

    const events =
        days === 7
            ? []
            : [
                  { occurred_at: '2026-07-05T02:31:38.731669Z', severity: 'moderate' as const, barangay: 'Tumaga' },
                  { occurred_at: '2026-07-05T14:01:38.226300Z', severity: 'major' as const, barangay: 'Arena Blanco' },
                  { occurred_at: '2026-07-09T10:48:29.142419Z', severity: 'major' as const, barangay: 'Taluksangay' },
              ]

    return { granularity, series, events }
}

export const rainfallTimelineFixture: Record<AnalyticsWindow, RainfallTimeline> = {
    7: buildRainfallTimeline(7, 'hour'),
    30: buildRainfallTimeline(30, 'day'),
    90: buildRainfallTimeline(90, 'day'),
}

export const modelPerformanceFixture: ValidationRunPoint[] = [
    { created_at: '2026-07-08T13:23:34.555935Z', recall: 0.7011494252873564, mean_score: 50.044022988505745, events_evaluated: 87, hits: 61 },
]
