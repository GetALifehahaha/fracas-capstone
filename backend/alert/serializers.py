from rest_framework import serializers

from barangays.models import Barangay

from .models import AlertEvent, Notification


class BroadcastSerializer(serializers.Serializer):
    """Operator broadcast payload: target barangay + custom message."""

    barangay = serializers.PrimaryKeyRelatedField(queryset=Barangay.objects.all())
    title = serializers.CharField(max_length=150, required=False, allow_blank=True)
    message = serializers.CharField()


class NotificationSerializer(serializers.ModelSerializer):
    barangay_name = serializers.CharField(source="barangay.name", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "barangay", "barangay_name", "category", "title", "body", "is_read", "created_at"]
        read_only_fields = fields


class AlertEventSerializer(serializers.ModelSerializer):
    """Read-only row for the operator audit log."""

    barangay_name = serializers.CharField(source="barangay.name", read_only=True)
    triggered_by_username = serializers.CharField(
        source="triggered_by.username", read_only=True, default=None
    )

    class Meta:
        model = AlertEvent
        fields = [
            "id", "barangay", "barangay_name", "level", "kind", "source",
            "score", "recipients", "suppressed", "triggered_by_username",
            "created_at",
        ]
        read_only_fields = fields
