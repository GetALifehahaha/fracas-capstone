/** Completed hindcast runs, captured from the live dev backend
 * (GET /api/admin/validation-runs/); `details` trimmed to a representative
 * sample of hits/misses/errors. New runs created during a mock session
 * transition pending -> running -> done based on elapsed time (see modelApi.ts). */
import type { ValidationRun } from '@/features/admin/types/model'

const validationRunsFixture: ValidationRun[] = [
    {
        id: 2,
        status: 'done',
        created_at: '2026-07-08T13:23:34.555935Z',
        finished_at: '2026-07-08T13:25:49.456611Z',
        events_evaluated: 87,
        hits: 61,
        recall: 0.7011494252873564,
        mean_score: 50.044022988505745,
        error: '',
        details: [
            { hit: true, error: null, score: 51.2, barangay: 'Muti', category: 'high', occurred_at: '2026-07-08T10:00:00.501633+00:00' },
            { hit: true, error: null, score: 51.2, barangay: 'Pangapuyan', category: 'high', occurred_at: '2026-07-08T10:00:00.501633+00:00' },
            { hit: true, error: null, score: 51.8, barangay: 'Panubigan', category: 'high', occurred_at: '2026-07-08T10:00:00.501633+00:00' },
            { hit: true, error: null, score: 54.04, barangay: 'Santo Niño', category: 'high', occurred_at: '2026-07-08T10:00:00.501633+00:00' },
            { hit: false, error: null, score: 41.46, barangay: 'Tolosa', category: 'medium', occurred_at: '2026-07-08T10:00:00.501633+00:00' },
            { hit: false, error: null, score: 44.04, barangay: 'Cabatangan', category: 'medium', occurred_at: '2026-07-08T10:00:00.501633+00:00' },
            { hit: false, error: null, score: 42.61, barangay: 'Cacao', category: 'medium', occurred_at: '2026-07-08T10:00:00.501633+00:00' },
            { hit: false, error: null, score: 41.2, barangay: 'Calabasa', category: 'medium', occurred_at: '2026-07-08T10:00:00.501633+00:00' },
            { hit: false, error: 'Archive request failed: 400 Client Error: Bad Request for url: https://archive-api.open-meteo.com/v1/archive', score: null, barangay: 'Guiwan', category: null, occurred_at: '2026-07-11T06:00:00+00:00' },
            { hit: false, error: "Archive request failed: HTTPSConnectionPool(host='archive-api.open-meteo.com', port=443): Read timed out.", score: null, barangay: 'Latuan (Curuan)', category: null, occurred_at: '2026-07-08T10:00:00.501633+00:00' },
        ],
    },
]

export default validationRunsFixture
