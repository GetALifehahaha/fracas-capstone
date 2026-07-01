from rest_framework import viewsets

from .models import Rainfall
from .serializers import RainfallSerializer


class RainfallViewset(viewsets.ReadOnlyModelViewSet):
    """Read-only access to machine-generated rainfall readings.

    Ordering comes from Rainfall.Meta (-recorded_at); not yet routed —
    client reads are served from the cached risk snapshot (see Phase 3).
    """

    queryset = Rainfall.objects.all()
    serializer_class = RainfallSerializer
