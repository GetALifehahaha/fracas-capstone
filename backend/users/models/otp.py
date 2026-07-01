from django.conf import settings
from django.db import models
from django.utils import timezone


class PhoneOTP(models.Model):
    """One-time code for verifying a user's phone number (SMS alerts require it)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="phone_otps"
    )
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    verified = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def is_valid(self, code: str) -> bool:
        return (
            not self.verified
            and self.code == code
            and timezone.now() <= self.expires_at
        )

    def __str__(self):
        return f"OTP for {self.user} ({'used' if self.verified else 'active'})"
