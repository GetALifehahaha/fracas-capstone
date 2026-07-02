"""System-wide, append-only audit of every alert transition.

Unlike `Notification` (one row per *recipient*) and `AlertState` (current level
only, overwritten each cycle), `AlertEvent` is the operator's canonical
"what fired and when" log: one row per alert transition — including episodes that
reached **zero** subscribers or were **suppressed** by an operator override, both
invisible to any per-recipient table. Never mutated after creation.
"""

from django.conf import settings
from django.db import models

from alert.constants import EventKind, EventSource
from barangays.models import Barangay
from risk_score.constants import RiskCategory


class AlertEvent(models.Model):
    barangay = models.ForeignKey(
        Barangay, on_delete=models.SET_NULL, null=True, related_name="+"
    )
    level = models.CharField(
        max_length=10,
        choices=RiskCategory.choices,
        help_text="Barangay category at the moment of the event.",
    )
    kind = models.CharField(max_length=10, choices=EventKind.choices)
    source = models.CharField(
        max_length=10, choices=EventSource.choices, default=EventSource.AUTOMATED
    )
    score = models.FloatField(
        null=True, blank=True, help_text="Hazard score (0-100); null for broadcasts."
    )
    recipients = models.PositiveIntegerField(
        default=0, help_text="Subscribers reached across all channels."
    )
    suppressed = models.BooleanField(
        default=False,
        help_text="Transition occurred but automated dispatch was muted "
        "(operator suppression), so no one was notified.",
    )
    triggered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
        help_text="Operator who sent a broadcast; null for automated events.",
    )
    dispatch_key = models.CharField(
        max_length=255, db_index=True, help_text="Ties back to NotificationLog rows."
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["barangay", "-created_at"])]

    def __str__(self):
        who = self.barangay.name if self.barangay else "?"
        return f"{who}: {self.kind} ({self.level}) -> {self.recipients}"
