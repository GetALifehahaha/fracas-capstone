/** Branch ui-build runs with no backend — served from static per-window fixtures. */
import type {
    AnalyticsSummary,
    AnalyticsWindow,
    Hotspot,
    RainfallTimeline,
    ValidationRunPoint,
} from '../types/api'
import { summaryFixture, rainfallTimelineFixture, modelPerformanceFixture } from '@/mocks/fixtures/analytics'
import { hotspotsFixture } from '@/mocks/fixtures/analyticsHotspots'
import { delay } from '@/mocks/utils'

export const getSummary = async (days: AnalyticsWindow): Promise<AnalyticsSummary> => {
    await delay()
    return summaryFixture[days]
}

export const getHotspots = async (days: AnalyticsWindow): Promise<Hotspot[]> => {
    await delay()
    return hotspotsFixture[days]
}

export const getRainfallTimeline = async (
    days: AnalyticsWindow,
): Promise<RainfallTimeline> => {
    await delay()
    return rainfallTimelineFixture[days]
}

export const getModelPerformance = async (): Promise<ValidationRunPoint[]> => {
    await delay()
    return modelPerformanceFixture
}
