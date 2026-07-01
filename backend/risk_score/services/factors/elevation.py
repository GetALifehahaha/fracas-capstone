"""Static vulnerability: terrain elevation, refined by hazard-map susceptibility.

Lower-lying barangays are more flood-prone. Vulnerability is the inverse of a
barangay's elevation *percentile rank* within the city — rank-based so a lone
high-mountain barangay doesn't compress everyone else toward "very vulnerable".
When a flood-susceptibility rating is available it's blended in equally.
"""

from risk_score.constants import FACTOR_VULNERABILITY
from risk_score.services.normalization import clamp, percentile_rank

from .base import FactorInput, FactorResult


class ElevationVulnerabilityFactor:
    key = FACTOR_VULNERABILITY

    def evaluate(self, data: FactorInput) -> FactorResult:
        barangay = data.barangay
        height = barangay.land_height_mean
        elevations = data.context.sorted_elevations
        if height is None or not elevations:
            return FactorResult(self.key, 0.0, available=False, detail={"reason": "no elevation data"})

        elevation_vuln = 1.0 - percentile_rank(height, elevations)

        susceptibility = barangay.flood_susceptibility
        if susceptibility is not None:
            value = clamp(0.5 * elevation_vuln + 0.5 * susceptibility)
        else:
            value = elevation_vuln

        return FactorResult(
            self.key,
            value,
            detail={
                "land_height_mean": height,
                "elevation_vulnerability": round(elevation_vuln, 4),
                "flood_susceptibility": susceptibility,
            },
        )
