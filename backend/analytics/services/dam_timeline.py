"""Pasonanca dam water-level series against its normal/critical thresholds.

Downstream barangays weight the dam heavily, so operators need to see the level
trend, where it sits versus the operator-tuned thresholds, and any spilling
episodes. Single dam for now (`.first()`); readings are already a time series.
"""

from dam_level.models import Dam


def build_dam_timeline(since):
    dam = Dam.objects.first()
    if dam is None:
        return {"dam": None, "series": [], "spilling": []}

    series = list(
        dam.readings.filter(recorded_at__gte=since)
        .order_by("recorded_at")
        .values("recorded_at", "water_level", "turbidity", "is_spilling")
    )
    spilling = [r for r in series if r["is_spilling"]]

    return {
        "dam": {
            "name": dam.name,
            "normal_level": dam.normal_level,
            "critical_level": dam.critical_level,
        },
        "series": series,
        "spilling": spilling,
    }
