"""Registration & Account Policy settings endpoint (admin)."""

from audit.serializers import SingletonSerializer
from audit.views import SingletonSettingsView

from .models import RegistrationPolicy


class RegistrationPolicySerializer(SingletonSerializer):
    class Meta:
        model = RegistrationPolicy
        fields = ["self_registration_enabled", "otp_ttl_minutes", "terms_version", "updated_at"]
        read_only_fields = ["updated_at"]


class RegistrationPolicyView(SingletonSettingsView):
    model = RegistrationPolicy
    serializer_class = RegistrationPolicySerializer
    target_label = "Registration policy"
