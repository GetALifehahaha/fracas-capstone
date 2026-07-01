from rest_framework import serializers

from .models import Device, NotificationPreference, Subscription


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
