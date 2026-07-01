"""Tunable risk-scoring configuration (weights + category thresholds).

Kept in the DB so an LGU operator can recalibrate the model via the admin
without a redeploy. Exactly one row is active at a time.
"""

from django.core.exceptions import ValidationError
from django.db import models

from risk_score.constants import (
    DEFAULT_THRESHOLDS,
    DEFAULT_WEIGHTS,
    FACTOR_KEYS,
    RiskCategory,
    SCORE_MAX,
)


def default_weights() -> dict:
    return dict(DEFAULT_WEIGHTS)


def default_thresholds() -> dict:
    return {cat.value: bound for cat, bound in DEFAULT_THRESHOLDS.items()}


# Category order from most to least severe — used to classify a score.
_SEVERITY_ORDER = (RiskCategory.CRITICAL, RiskCategory.HIGH, RiskCategory.MEDIUM)


class RiskConfig(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False, db_index=True)
    weights = models.JSONField(default=default_weights)
    thresholds = models.JSONField(default=default_thresholds)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        active = " (active)" if self.is_active else ""
        return f"{self.name}{active}"

    # --- validation -----------------------------------------------------
    def clean(self):
        missing = set(FACTOR_KEYS) - set(self.weights)
        if missing:
            raise ValidationError({"weights": f"Missing factor weights: {sorted(missing)}"})
        total = sum(self.weights.get(k, 0) for k in FACTOR_KEYS)
        if abs(total - 1.0) > 1e-6:
            raise ValidationError({"weights": f"Weights must sum to 1.0 (got {total})."})

        bounds = [self.thresholds.get(c.value) for c in _SEVERITY_ORDER]
        if any(b is None for b in bounds):
            raise ValidationError({"thresholds": "Provide medium/high/critical bounds."})
        # critical > high > medium, all within scale.
        if not (0 < bounds[2] < bounds[1] < bounds[0] <= SCORE_MAX):
            raise ValidationError({"thresholds": "Thresholds must be ordered medium < high < critical."})

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_active:
            RiskConfig.objects.exclude(pk=self.pk).filter(is_active=True).update(is_active=False)

    # --- behaviour ------------------------------------------------------
    def categorize(self, score: float) -> RiskCategory:
        for category in _SEVERITY_ORDER:
            if score >= self.thresholds[category.value]:
                return category
        return RiskCategory.LOW

    @classmethod
    def get_active(cls) -> "RiskConfig":
        """Active config, or an unsaved defaults instance so scoring never fails."""
        active = cls.objects.filter(is_active=True).first()
        return active or cls(name="defaults", is_active=True)
