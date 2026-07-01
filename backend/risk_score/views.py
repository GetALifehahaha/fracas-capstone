"""Risk API: read-only risk views (authenticated) + admin validation runs."""

from rest_framework import mixins
from rest_framework.generics import RetrieveAPIView, get_object_or_404
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from barangays.models import Barangay
from rainfall_fetch.models import Rainfall

from .models import RiskScore, ValidationRun
from .serializers import BarangayRiskSerializer, ValidationRunSerializer
from .services import snapshot
from .tasks import run_validation_task


class RiskSnapshotView(APIView):
    """Latest risk for every barangay — powers map coloring and risk cards."""

    def get(self, request):
        return Response(snapshot.latest())


class BarangayRiskView(RetrieveAPIView):
    """Full latest risk + rainfall detail for one barangay."""

    serializer_class = BarangayRiskSerializer

    def get_object(self):
        barangay = get_object_or_404(Barangay, pk=self.kwargs["pk"])
        score = (
            RiskScore.objects.filter(barangay=barangay).order_by("-computed_at").first()
        )
        rainfall = (
            Rainfall.objects.filter(barangay=barangay).order_by("-recorded_at").first()
        )
        return {"barangay": barangay, "score": score, "rainfall": rainfall}


class ValidationRunViewSet(
    mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet
):
    """Admin-only: trigger a hindcast validation run (async) and poll results."""

    queryset = ValidationRun.objects.all()
    serializer_class = ValidationRunSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        run = serializer.save(created_by=self.request.user)
        run_validation_task.delay(run.id)
