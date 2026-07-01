"""Per-message delivery audit across all channels.

`dedup_key` makes dispatch idempotent: the same alert episode never sends the
same channel to the same user twice, even if the task retries.
"""

from django.conf import settings
from django.db import models

from alert.constants import Channel, DeliveryStatus
from barangays.models import Barangay


class NotificationLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="+"
    )
    barangay = models.ForeignKey(
        Barangay, on_delete=models.SET_NULL, null=True, related_name="+"
    )
    channel = models.CharField(max_length=10, choices=Channel.choices)
    status = models.CharField(
        max_length=10, choices=DeliveryStatus.choices, default=DeliveryStatus.PENDING
    )
    dedup_key = models.CharField(max_length=255, db_index=True)
    detail = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "channel", "dedup_key"], name="uniq_notification_dispatch"
            )
        ]

    def __str__(self):
        return f"{self.channel} -> {self.user} [{self.status}]"
