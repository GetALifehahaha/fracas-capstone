/** Alert audit-log sample, captured from the live dev backend
 * (GET /api/alerts/events/), covering all four transition kinds. Newest first. */
import type { AlertEvent } from '@/features/alerts/types/api'

const alertEventsFixture: AlertEvent[] = [
    { id: 937, barangay: 101, barangay_name: 'Watershed Area under Jurisdiction of Zamboanga City', level: 'medium', kind: 'all_clear', source: 'automated', score: 41.067, recipients: 0, suppressed: false, triggered_by_username: null, created_at: '2026-07-21T09:50:49.950786Z' },
    { id: 936, barangay: 100, barangay_name: 'Unclaimed Area under Jurisdiction of Zamboanga City', level: 'medium', kind: 'all_clear', source: 'automated', score: 42.123, recipients: 0, suppressed: false, triggered_by_username: null, created_at: '2026-07-21T09:50:49.945286Z' },
    { id: 935, barangay: 99, barangay_name: 'Pasonanca Natural Park under Jurisdiction of Zamboanga City', level: 'medium', kind: 'all_clear', source: 'automated', score: 41.2265, recipients: 0, suppressed: false, triggered_by_username: null, created_at: '2026-07-21T09:50:49.939572Z' },
    { id: 934, barangay: 98, barangay_name: 'Zambowood', level: 'high', kind: 'all_clear', source: 'automated', score: 51.0175, recipients: 12, suppressed: false, triggered_by_username: null, created_at: '2026-07-21T09:50:49.934419Z' },
    { id: 933, barangay: 97, barangay_name: 'Victoria', level: 'high', kind: 'all_clear', source: 'automated', score: 51.76, recipients: 4, suppressed: false, triggered_by_username: null, created_at: '2026-07-21T09:50:49.928922Z' },
    { id: 932, barangay: 96, barangay_name: 'Pasobolong', level: 'medium', kind: 'all_clear', source: 'automated', score: 41.0175, recipients: 0, suppressed: false, triggered_by_username: null, created_at: '2026-07-21T09:50:49.923554Z' },
    { id: 837, barangay: 101, barangay_name: 'Watershed Area under Jurisdiction of Zamboanga City', level: 'critical', kind: 'entered', source: 'automated', score: 80.0, recipients: 0, suppressed: false, triggered_by_username: null, created_at: '2026-07-10T02:30:01.240062Z' },
    { id: 836, barangay: 100, barangay_name: 'Unclaimed Area under Jurisdiction of Zamboanga City', level: 'critical', kind: 'entered', source: 'automated', score: 80.0, recipients: 0, suppressed: false, triggered_by_username: null, created_at: '2026-07-10T02:30:01.235139Z' },
    { id: 835, barangay: 99, barangay_name: 'Pasonanca Natural Park under Jurisdiction of Zamboanga City', level: 'critical', kind: 'entered', source: 'automated', score: 80.0, recipients: 0, suppressed: false, triggered_by_username: null, created_at: '2026-07-10T02:30:01.229874Z' },
    { id: 834, barangay: 98, barangay_name: 'Zambowood', level: 'critical', kind: 'entered', source: 'automated', score: 100.0, recipients: 12, suppressed: false, triggered_by_username: null, created_at: '2026-07-10T02:30:01.225114Z' },
    { id: 833, barangay: 97, barangay_name: 'Victoria', level: 'critical', kind: 'entered', source: 'automated', score: 100.0, recipients: 4, suppressed: false, triggered_by_username: null, created_at: '2026-07-10T02:30:01.220442Z' },
    { id: 832, barangay: 96, barangay_name: 'Pasobolong', level: 'critical', kind: 'entered', source: 'automated', score: 80.0, recipients: 0, suppressed: true, triggered_by_username: null, created_at: '2026-07-10T02:30:01.215776Z' },
    { id: 637, barangay: 101, barangay_name: 'Watershed Area under Jurisdiction of Zamboanga City', level: 'critical', kind: 'renotify', source: 'automated', score: 80.0, recipients: 0, suppressed: false, triggered_by_username: null, created_at: '2026-07-09T21:58:50.744515Z' },
    { id: 636, barangay: 100, barangay_name: 'Unclaimed Area under Jurisdiction of Zamboanga City', level: 'critical', kind: 'renotify', source: 'automated', score: 80.0, recipients: 0, suppressed: false, triggered_by_username: null, created_at: '2026-07-09T21:58:50.737692Z' },
    { id: 635, barangay: 99, barangay_name: 'Pasonanca Natural Park under Jurisdiction of Zamboanga City', level: 'critical', kind: 'renotify', source: 'automated', score: 80.0, recipients: 0, suppressed: false, triggered_by_username: null, created_at: '2026-07-09T21:58:50.731984Z' },
    { id: 634, barangay: 98, barangay_name: 'Zambowood', level: 'critical', kind: 'renotify', source: 'automated', score: 100.0, recipients: 12, suppressed: false, triggered_by_username: null, created_at: '2026-07-09T21:58:50.726007Z' },
    { id: 27, barangay: 1, barangay_name: 'Arena Blanco', level: 'critical', kind: 'broadcast', source: 'operator', score: null, recipients: 156, suppressed: false, triggered_by_username: 'root', created_at: '2026-07-05T02:29:32.712495Z' },
    { id: 26, barangay: 19, barangay_name: 'Curuan', level: 'critical', kind: 'broadcast', source: 'operator', score: null, recipients: 64, suppressed: false, triggered_by_username: 'root', created_at: '2026-07-02T23:18:00.961240Z' },
]

export default alertEventsFixture
