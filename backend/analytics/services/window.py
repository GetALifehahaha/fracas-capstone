"""Shared time-window parsing for the analytics endpoints.

Operators pick a look-back window (7 / 30 / 90 days) that drives every panel;
this normalises the `?days=` query param to a clamped integer + a `since`
datetime so the service functions never see out-of-range or garbage input.
"""

from datetime import timedelta

from django.utils import timezone

DEFAULT_DAYS = 30
MAX_DAYS = 90
MIN_DAYS = 1


def parse_window(request):
    """Return `(since_dt, days)` from the request's `?days=` param.

    Falls back to the default and clamps to [MIN_DAYS, MAX_DAYS] so a client
    can never request an unbounded scan of the history tables.
    """
    raw = request.query_params.get("days")
    try:
        days = int(raw) if raw is not None else DEFAULT_DAYS
    except (TypeError, ValueError):
        days = DEFAULT_DAYS
    days = max(MIN_DAYS, min(days, MAX_DAYS))
    since = timezone.now() - timedelta(days=days)
    return since, days
