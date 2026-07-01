"""Static vulnerability from terrain elevation.

Lower-lying barangays are more flood-prone, so vulnerability is the inverse
of where a barangay's mean elevation sits within the city's elevation range.
Richer static factors (susceptibility rating, distance to river) are Phase 1.
"""

from risk_score.constants import FACTOR_VULNERABILITY
from risk_score.services.normalization import normalize_position

from .base import FactorInput, FactorResult


class ElevationVulnerabilityFactor:
    key = FACTOR_VULNERABILITY

    def evaluate(self, data: FactorInput) -> FactorResult:
        height = data.barangay.land_height_mean
        bounds = data.context.elevation_bounds
        if height is None or bounds is None:
            return FactorResult(self.key, 0.0, available=False, detail={"reason": "no elevation data"})

        low, high = bounds
        vulnerability = 1.0 - normalize_position(height, low, high)
        return FactorResult(
            self.key,
            vulnerability,
            detail={"land_height_mean": height, "elevation_low": low, "elevation_high": high},
        )
