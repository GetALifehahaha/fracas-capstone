from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Project user tied to JWT auth.

    Extends Django's AbstractUser (username/email/password/permissions) with
    the fields the alerting subsystem needs. Barangay subscriptions, device
    tokens, and notification preferences live in their own models (Phase 4).
    """

    phone_number = models.CharField(
        max_length=15, unique=True, null=True, blank=True
    )
    phone_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.get_username()
