import type { ExpressionSpecification } from 'maplibre-gl'
import type { RiskCategory } from '../types/api'

/** Severity, most-critical first — drives summary ordering. */
export const CATEGORY_ORDER: RiskCategory[] = ['critical', 'high', 'medium', 'low']

export const CATEGORY_LABELS: Record<RiskCategory, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
}

/**
 * White → red intensity ramp. Danger reads as saturation/darkness of red:
 * low is nearly white (calm), critical is deep red. Single source of truth for
 * the map fill, the legend, and category badges/dots.
 */
export const RISK_COLORS: Record<RiskCategory, string> = {
    low: '#fdeaea',
    medium: '#f2a1a1',
    high: '#dd4b4b',
    critical: '#b01212',
}

/** Barangays with no computed score yet (empty pipeline). */
export const NO_DATA_COLOR = '#e5e7eb'

/** MapLibre fill-color expression keyed on the joined `category` property. */
export const fillColorExpression: ExpressionSpecification = [
    'match',
    ['get', 'category'],
    'low', RISK_COLORS.low,
    'medium', RISK_COLORS.medium,
    'high', RISK_COLORS.high,
    'critical', RISK_COLORS.critical,
    NO_DATA_COLOR,
]

/** Tailwind class helper so DOM chips match the map exactly. */
export const categoryColor = (category: RiskCategory): string => RISK_COLORS[category]
