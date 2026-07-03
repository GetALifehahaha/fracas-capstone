from rest_framework import serializers

from .models import Device, NotificationPreference, Subscription, User


class OperatorSerializer(serializers.ModelSerializer):
    """Lean {id, name} shape for operator pickers (no PII beyond a display name)."""

    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name"]

    def get_name(self, user) -> str:
        return user.get_full_name() or user.get_username()


class CurrentUserSerializer(serializers.ModelSerializer):
    """The signed-in user's own profile, for djoser's `/users/me/` (GET + PATCH).

    Operators edit their name and email; `username`, `phone_number`, activation
    and the derived `role` are read-only here (identity/authorization are managed
    elsewhere, not self-service from the console)."""

    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "is_active",
            "role",
        ]
        read_only_fields = ["id", "username", "phone_number", "is_active", "role"]


class SubscriptionSerializer(serializers.ModelSerializer):
    barangay_name = serializers.CharField(source="barangay.name", read_only=True)

    class Meta:
        model = Subscription
        fields = ["id", "barangay", "barangay_name", "created_at"]
        read_only_fields = ["created_at"]


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ["id", "token", "platform", "is_active", "created_at"]
        read_only_fields = ["is_active", "created_at"]
        # perform_create upserts by token, so drop DRF's auto UniqueValidator.
        extra_kwargs = {"token": {"validators": []}}


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            "sms_enabled",
            "push_enabled",
            "inapp_enabled",
            "quiet_hours_start",
            "quiet_hours_end",
        ]
