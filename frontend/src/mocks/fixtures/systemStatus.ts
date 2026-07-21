/** Base template for the admin ops dashboard. `getSystemStatus` re-stamps every
 * timestamp relative to "now" on each call so the page doesn't look frozen. */
import type { SystemStatus, AutoDetectConfig } from '@/features/admin/types/system'

export const systemStatusTemplate: SystemStatus = {
    healthy: true,
    database: { ok: true, detail: 'ok' },
    cache: { ok: true, detail: 'ok' },
    ingestion: {
        rainfall: { fresh: true, last_success_at: null, status: 'ok', consecutive_failures: 0 },
    },
    pipeline: {
        rainfall: { last_run: null, fresh: true },
        scoring: { last_run: null, fresh: true },
        alerts: { last_run: null, fresh: true },
    },
    cadence: [
        { task: 'scoring-pipeline-15min', cadence: 'Every 15 minutes' },
        { task: 'cleanup-old-data-daily', cadence: 'Daily at 03:00' },
        { task: 'purge-soft-deleted-flood-events-hourly', cadence: 'Hourly' },
    ],
}

export const autoDetectConfigFixture: AutoDetectConfig = {
    enabled: true,
    threshold_category: 'critical',
    updated_at: '2026-07-09T08:13:07.665938Z',
}
