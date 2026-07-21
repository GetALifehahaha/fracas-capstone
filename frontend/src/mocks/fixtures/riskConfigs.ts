import type { RiskConfig } from '@/features/admin/types/model'

const riskConfigsFixture: RiskConfig[] = [
    {
        id: 1,
        name: 'Default',
        is_active: true,
        weights: { rainfall: 0.5, susceptibility: 0.5 },
        thresholds: { high: 50.0, medium: 25.0, critical: 75.0 },
        created_at: '2026-07-01T08:41:18.886420Z',
    },
]

export default riskConfigsFixture
