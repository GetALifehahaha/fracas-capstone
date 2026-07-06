"""KPI summary row for the operator analytics page.

Blends *windowed* flood impact (events / people affected in the look-back) with
*current* situational state (barangays presently high/critical, latest dam
reading, latest validation recall) into one cheap payload.
"""

from django.db.models import Count, Sum

from alert.models import AlertState
from dam_level.models import Dam
from flood_events.models import FloodEvent
from risk_score.constants import RiskCategory
from risk_score.models import ValidationRun


def _confirmed_events(since):
    """Confirmed, not-soft-deleted flood events since `since`.

    Auto-detected drafts awaiting LGU confirmation and soft-deleted rows are
    excluded so operator-facing counts never overstate reality.
    """
    return FloodEvent.objects.filter(
        occurred_at__gte=since, deleted_at__isnull=True, is_confirmed=True
    )


def _dam_snapshot():
    dam = Dam.objects.first()
    if dam is None:
        return None
    latest = dam.readings.first()  # DamReading default ordering is -recorded_at
    if latest is None:
        return None
    span = dam.critical_level - dam.normal_level
    pct = None
    if span > 0:
        frac = (latest.water_level - dam.normal_level) / span
        pct = round(max(0.0, min(1.0, frac)) * 100.0, 1)
    return {
        "name": dam.name,
        "water_level": latest.water_level,
        "normal_level": dam.normal_level,
        "critical_level": dam.critical_level,
        "pct_to_critical": pct,
        "is_spilling": latest.is_spilling,
        "recorded_at": latest.recorded_at,
    }


def _latest_validation():
    run = ValidationRun.objects.filter(status=ValidationRun.Status.DONE).first()
    if run is None:
        return None
    return {
        "recall": run.recall,
        "mean_score": run.mean_score,
        "events_evaluated": run.events_evaluated,
        "created_at": run.created_at,
    }


def build_summary(since):
    events = _confirmed_events(since)
    impact = events.aggregate(
        people_affected=Sum("people_affected"),
        people_evacuated=Sum("people_evacuated"),
    )
    # Current risk distribution comes from AlertState (one row per barangay,
    # overwritten each cycle) — cheaper than re-deriving from RiskScore history.
    level_counts = dict(
        AlertState.objects.values_list("level").annotate(n=Count("pk"))
    )
    return {
        "flood_events": events.count(),
        "people_affected": impact["people_affected"] or 0,
        "people_evacuated": impact["people_evacuated"] or 0,
        "barangays_critical": level_counts.get(RiskCategory.CRITICAL, 0),
        "barangays_high": level_counts.get(RiskCategory.HIGH, 0),
        "dam": _dam_snapshot(),
        "validation": _latest_validation(),
    }
