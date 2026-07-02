import { Card } from '@/common/ui/card'
import { CATEGORY_LABELS, RISK_COLORS } from '../constants/risk'
import type { RiskCategory } from '../types/api'

// Low → critical, so the swatch column reads as a white→red ramp.
const ORDER: RiskCategory[] = ['low', 'medium', 'high', 'critical']

const Legend = () => (
    <Card size='sm' className='absolute top-4 left-4 z-2 flex w-1/8 flex-col gap-1 px-2'>
        <h5 className='font-medium'>Legend</h5>
        {ORDER.map((category) => (
            <span key={category} className='flex items-center gap-2'>
                <div
                    className='aspect-square w-2 rounded-full ring-1 ring-foreground/10'
                    style={{ backgroundColor: RISK_COLORS[category] }}
                />
                <h5 className='text-muted-foreground text-xs font-medium'>
                    {CATEGORY_LABELS[category]}
                </h5>
            </span>
        ))}
    </Card>
)

export default Legend
