"""Read-only dam status + geometry API (authenticated)."""

import json

from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Dam


class DamStatusView(APIView):
    """Latest Pasonanca reading + thresholds for the dam-status widget."""

    def get(self, request):
        dam = Dam.objects.first()
        if dam is None:
            return Response({"has_data": False})

        reading = dam.readings.first()  # latest (Meta ordering)
        data = {
            "dam": dam.name,
            "normal_level": dam.normal_level,
            "critical_level": dam.critical_level,
            "influence_radius_km": dam.influence_radius_km,
            "location": list(dam.location.coords) if dam.location else None,
            "has_data": reading is not None,
        }
        if reading is not None:
            data.update(
                {
                    "current_level": reading.water_level,
                    "rate_of_change": reading.rate_of_change,
                    "is_spilling": reading.is_spilling,
                    "turbidity": reading.turbidity,
                    "recorded_at": reading.recorded_at.isoformat(),
                }
            )
        return Response(data)


class DamGeoView(APIView):
    """The dam point + river corridor as a GeoJSON FeatureCollection for the map."""

    def get(self, request):
        features = []
        for dam in Dam.objects.exclude(location__isnull=True):
            features.append(
                {
                    "type": "Feature",
                    "geometry": json.loads(dam.location.geojson),
                    "properties": {
                        "id": dam.id,
                        "name": dam.name,
                        "kind": "dam",
                        "influence_radius_km": dam.influence_radius_km,
                    },
                }
            )
            if dam.river is not None:
                features.append(
                    {
                        "type": "Feature",
                        "geometry": json.loads(dam.river.geojson),
                        "properties": {"id": dam.id, "name": dam.name, "kind": "river"},
                    }
                )
        return Response({"type": "FeatureCollection", "features": features})
