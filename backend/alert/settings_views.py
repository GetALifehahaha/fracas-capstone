"""Alerting Policy settings endpoint (admin)."""

from audit.serializers import SingletonSerializer
from audit.views import SingletonSettingsView

from .models import AlertingPolicy


class AlertingPolicySerializer(SingletonSerializer):
    class Meta:
        model = AlertingPolicy
        fields = ["trigger_category", "renotify_interval_minutes", "send_all_clear", "updated_at"]
        read_only_fields = ["updated_at"]


class AlertingPolicyView(SingletonSettingsView):
    model = AlertingPolicy
    serializer_class = AlertingPolicySerializer
    target_label = "Alerting policy"
