"""Admin-editable alerting policy (cached singleton).

Re-points the hardcoded `ALERT_LEVEL` / `RENOTIFY_INTERVAL` in
`alert/services/evaluation.py`. Defaults match today's behavior (trigger on
CRITICAL, re-notify hourly, send all-clear) so nothing changes until edited.
"""

from datetime import timedelta

from django.core.exceptions import ValidationError
from django.db import models

from audit.models import SingletonModel
from risk_score.constants import RiskCategory

# low < medium < high < critical — used to test "score is in the trigger band".
_RANK = {
    RiskCategory.LOW: 0,
    RiskCategory.MEDIUM: 1,
    RiskCategory.HIGH: 2,
    RiskCategory.CRITICAL: 3,
}


class AlertingPolicy(SingletonModel):
    class TriggerCategory(models.TextChoices):
        HIGH = RiskCategory.HIGH.value, "High and above"
        CRITICAL = RiskCategory.CRITICAL.value, "Critical only"

    trigger_category = models.CharField(
        max_length=10,
        choices=TriggerCategory.choices,
        default=TriggerCategory.CRITICAL,
        help_text="Minimum risk category that triggers a resident alert.",
    )
    renotify_interval_minutes = models.PositiveIntegerField(
        default=60, help_text="Cooldown before re-notifying a still-triggered barangay."
    )
    send_all_clear = models.BooleanField(
        default=True, help_text="Notify when a barangay drops out of the trigger band."
    )
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.renotify_interval_minutes < 1:
            raise ValidationError(
                {"renotify_interval_minutes": "Must be at least 1 minute."}
            )

    @property
    def renotify_interval(self) -> timedelta:
        return timedelta(minutes=self.renotify_interval_minutes)

    def triggers(self, category) -> bool:
        """Is `category` at or above the configured trigger threshold?"""
        return _RANK.get(category, 0) >= _RANK[self.trigger_category]

    def __str__(self):
        return f"Alerting policy (>= {self.trigger_category})"
