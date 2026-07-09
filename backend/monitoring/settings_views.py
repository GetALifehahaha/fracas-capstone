"""Admin Settings endpoints owned by monitoring, plus the public config read."""

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from audit.views import SingletonSettingsView

from .models import OperationalToggles, OrganizationSettings, RetentionPolicy
from .serializers import (
    OperationalTogglesSerializer,
    OrganizationSettingsSerializer,
    PublicConfigSerializer,
    RetentionPolicySerializer,
)


class RetentionPolicyView(SingletonSettingsView):
    model = RetentionPolicy
    serializer_class = RetentionPolicySerializer
    target_label = "Retention policy"


class OperationalTogglesView(SingletonSettingsView):
    model = OperationalToggles
    serializer_class = OperationalTogglesSerializer
    target_label = "Operational toggles"


class OrganizationSettingsView(SingletonSettingsView):
    model = OrganizationSettings
    serializer_class = OrganizationSettingsSerializer
    target_label = "Organization"


class PublicConfigView(APIView):
    """Branding + announcement banner for every client. No auth, no secrets."""

    authentication_classes: list = []
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(PublicConfigSerializer(instance={}).data)
