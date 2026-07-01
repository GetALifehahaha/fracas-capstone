"""Composes factor contributions into a single hazard score.

Weighting rule: each factor's raw weight comes from the active RiskConfig.
Factors whose input is unavailable are dropped and their weight is
redistributed across the available ones — a missing input never silently
depresses the score. If nothing is available, the result is a degraded 0.
"""

from __future__ import annotations

from dataclasses import dataclass

from risk_score.constants import SCORE_MAX, RiskCategory
from risk_score.models import RiskConfig

from .factors import DEFAULT_FACTORS, FactorInput, RiskFactor


@dataclass(frozen=True)
class ScoredResult:
    score: float  # 0-100
    category: RiskCategory
    breakdown: dict
    is_degraded: bool


class RiskEngine:
    def __init__(self, config: RiskConfig, factors: list[RiskFactor]):
        self.config = config
        self.factors = factors

    @classmethod
    def from_active_config(cls, factors: list[RiskFactor] | None = None) -> "RiskEngine":
        return cls(RiskConfig.get_active(), factors or DEFAULT_FACTORS)

    def score(self, data: FactorInput) -> ScoredResult:
        weights = self.config.weights
        results = [f.evaluate(data) for f in self.factors]
        available = [r for r in results if r.available]

        total_weight = sum(weights.get(r.key, 0.0) for r in available)
        composite = 0.0
        if total_weight > 0:
            for r in available:
                composite += r.value * (weights.get(r.key, 0.0) / total_weight)

        breakdown = {
            r.key: {
                "value": round(r.value, 4),
                "raw_weight": weights.get(r.key, 0.0),
                "available": r.available,
                "detail": r.detail,
            }
            for r in results
        }

        score = composite * SCORE_MAX
        return ScoredResult(
            score=score,
            category=self.config.categorize(score),
            breakdown=breakdown,
            is_degraded=any(not r.available for r in results),
        )
