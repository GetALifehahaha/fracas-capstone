/** Audit trail per flood event, captured from the live dev backend
 * (GET /api/flood-events/:id/changes/), keyed by flood event id. */
import type { FloodEventChange } from '@/features/history/types/api'

const floodEventChangesFixture: Record<number, FloodEventChange[]> = {
    1: [],
    2: [
        { id: 3, editor_name: 'Root Root', action: 'resolved', field: 'ended_at', old_value: '', new_value: '2026-07-17 14:29:00+00:00', changed_at: '2026-07-03T14:29:58.727509Z' },
        { id: 2, editor_name: 'Root Root', action: 'updated', field: 'occurred_at', old_value: '2026-07-01 06:00:00+00:00', new_value: '2026-07-11 06:00:00+00:00', changed_at: '2026-07-03T14:29:42.057977Z' },
        { id: 1, editor_name: 'Root Root', action: 'updated', field: 'occurred_at', old_value: '2024-08-02 06:00:00+00:00', new_value: '2026-07-01 06:00:00+00:00', changed_at: '2026-07-03T12:48:17.204550Z' },
    ],
    3: [],
    4: [
        { id: 5, editor_name: 'Root Root', action: 'confirmed', field: '', old_value: '', new_value: '', changed_at: '2026-07-05T02:32:07.596259Z' },
        { id: 4, editor_name: null, action: 'created', field: '', old_value: '', new_value: '', changed_at: '2026-07-05T02:31:38.862895Z' },
    ],
    5: [
        { id: 10, editor_name: 'Root Root', action: 'confirmed', field: '', old_value: '', new_value: '', changed_at: '2026-07-07T00:10:26.059266Z' },
        { id: 9, editor_name: 'Root Root', action: 'resolved', field: 'ended_at', old_value: '', new_value: '2026-07-07 00:10:00+00:00', changed_at: '2026-07-07T00:10:20.187459Z' },
        { id: 6, editor_name: null, action: 'created', field: '', old_value: '', new_value: '', changed_at: '2026-07-05T14:01:38.364881Z' },
    ],
    17: [
        { id: 20, editor_name: null, action: 'created', field: '', old_value: '', new_value: '', changed_at: '2026-07-07T03:17:36.697414Z' },
    ],
    234: [
        { id: 237, editor_name: null, action: 'created', field: '', old_value: '', new_value: '', changed_at: '2026-07-09T10:48:29.593631Z' },
    ],
    9001: [
        { id: 300, editor_name: 'Root Root', action: 'deleted', field: '', old_value: '', new_value: '', changed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { id: 299, editor_name: 'Root Root', action: 'resolved', field: 'ended_at', old_value: '', new_value: '2026-06-20 18:00:00+00:00', changed_at: '2026-06-20T18:00:05Z' },
        { id: 298, editor_name: 'Root Root', action: 'created', field: '', old_value: '', new_value: '', changed_at: '2026-06-20T08:00:10Z' },
    ],
}

export default floodEventChangesFixture
