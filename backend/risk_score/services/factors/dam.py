"""Dam hazard: Pasonanca level as a proxy for downstream Tumaga river stage.

Placeholder until Phase 1 lands the ZCWD `DamReading` ingestion and the
per-barangay `is_downstream` flag. Until then it reports unavailable so its
weight is redistributed rather than counted as zero hazard.

Planned logic (Phase 1):
    level_ratio = (current - normal) / (critical - normal)
    hazard = f(level_ratio, rate_of_rise, spilling)   # weighted for downstream barangays
"""

from risk_score.constants import FACTOR_DAM

from .base import FactorInput, FactorResult


class DamFactor:
    key = FACTOR_DAM

    def evaluate(self, data: FactorInput) -> FactorResult:
        reading = data.context.dam_reading
        if reading is None:
            return FactorResult(self.key, 0.0, available=False, detail={"reason": "dam ingestion is Phase 1"})

        # Phase 1 will replace this branch with the real computation.
        return FactorResult(self.key, 0.0, available=False, detail={"reason": "not yet implemented"})
