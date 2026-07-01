"""Pure normalization helpers — no DB, easy to unit-test.

All hazard values live on a 0.0-1.0 scale before the engine weights them.
"""


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def piecewise_linear(x: float, points: list[tuple[float, float]]) -> float:
    """Interpolate y for x across sorted (x, y) breakpoints; flat past the ends."""
    if x <= points[0][0]:
        return points[0][1]
    if x >= points[-1][0]:
        return points[-1][1]
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        if x0 <= x <= x1:
            span = x1 - x0
            return y0 if span == 0 else y0 + (y1 - y0) * (x - x0) / span
    return points[-1][1]


# Breakpoints aligned to PAGASA rainfall-warning thresholds (mm/hr):
# yellow 7.5, orange 15, red 30. Escalates to full hazard at the red level.
_RAINFALL_CURVE = [(0.0, 0.0), (7.5, 0.33), (15.0, 0.66), (30.0, 1.0)]


def normalize_rainfall(mm_per_hr: float) -> float:
    """Map a rainfall intensity (mm/hr) to a 0-1 hazard using PAGASA bands."""
    return clamp(piecewise_linear(max(0.0, mm_per_hr), _RAINFALL_CURVE))


def normalize_position(value: float, low: float, high: float) -> float:
    """Where `value` sits in [low, high] as 0-1. Degenerate range -> 0."""
    if high <= low:
        return 0.0
    return clamp((value - low) / (high - low))
