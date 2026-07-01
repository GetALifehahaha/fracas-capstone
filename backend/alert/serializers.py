from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    barangay_name = serializers.CharField(source="barangay.name", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "barangay", "barangay_name", "category", "title", "body", "is_read", "created_at"]
        read_only_fields = fields
