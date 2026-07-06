import { Button } from '@/common/ui/button'
import { ButtonGroup } from '@/common/ui/button-group'
import { WINDOW_OPTIONS } from '../constants/analytics'
import type { AnalyticsWindow } from '../types/api'

interface WindowSelectorProps {
    value: AnalyticsWindow
    onChange: (days: AnalyticsWindow) => void
}

/** Segmented 7 / 30 / 90-day control that drives every panel's query. */
const WindowSelector = ({ value, onChange }: WindowSelectorProps) => (
    <ButtonGroup className='rounded-lg bg-white'>
        {WINDOW_OPTIONS.map(({ value: v, label }) => (
            <Button
                key={v}
                type='button'
                size='sm'
                variant={v === value ? 'default' : 'ghost'}
                aria-pressed={v === value}
                onClick={() => onChange(v)}
            >
                {label}
            </Button>
        ))}
    </ButtonGroup>
)

export default WindowSelector
