from django.db import models


class Channel(models.TextChoices):
    SMS = "sms", "SMS"
    PUSH = "push", "Push"
    INAPP = "inapp", "In-app"


class DeliveryStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    SENT = "sent", "Sent"
    FAILED = "failed", "Failed"
    SKIPPED = "skipped", "Skipped"


class EventKind(models.TextChoices):
    """What kind of alert transition an `AlertEvent` records."""

    ENTERED = "entered", "Entered critical"
    RENOTIFY = "renotify", "Re-notified (still critical)"
    ALL_CLEAR = "all_clear", "All clear"
    BROADCAST = "broadcast", "Operator broadcast"


class EventSource(models.TextChoices):
    """Who originated the alert event."""

    AUTOMATED = "automated", "Automated (pipeline)"
    OPERATOR = "operator", "Operator"
