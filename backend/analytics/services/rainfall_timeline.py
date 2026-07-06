"""City-wide rainfall trend with actual flood events overlaid.

Answers "is a storm building, and did it flood?" — the core operational story.
We bucket every barangay's 24h accumulation into a time series (avg + max
across the city) and return confirmed flood events as markers to overlay.
"""

from django.db.models.functions import Trunc

from django.db.models import Avg, Max

from rainfall_fetch.models import Rainfall

from .summary import _confirmed_events

# Hourly buckets read well for a week; longer windows switch to daily so the
# chart stays legible and the GROUP BY stays cheap.
HOURLY_MAX_DAYS = 7


def _granularity(days):
    return "hour" if days <= HOURLY_MAX_DAYS else "day"


def build_rainfall_timeline(since, days):
    gran = _granularity(days)
    buckets = (
        Rainfall.objects.filter(recorded_at__gte=since)
        .annotate(bucket=Trunc("recorded_at", gran))
        .values("bucket")
        .annotate(avg_24h=Avg("accumulated_24hr"), max_24h=Max("accumulated_24hr"))
        .order_by("bucket")
    )
    series = [
        {"bucket": r["bucket"], "avg_24h": r["avg_24h"], "max_24h": r["max_24h"]}
        for r in buckets
    ]

    events = [
        {
            "occurred_at": f["occurred_at"],
            "severity": f["severity"],
            "barangay": f["barangay__name"],
        }
        for f in _confirmed_events(since)
        .select_related("barangay")
        .values("occurred_at", "severity", "barangay__name")
        .order_by("occurred_at")
    ]

    return {"granularity": gran, "series": series, "events": events}
