"""Validation recall / mean-score trend across hindcast runs.

Proof the early-warning model actually works — the recall trend across recorded
`ValidationRun`s (great for LGU reporting). Runs are infrequent, so we return
the most recent completed ones as a trend rather than windowing by days.
"""

from risk_score.models import ValidationRun

DEFAULT_LIMIT = 20


def build_model_performance(limit=DEFAULT_LIMIT):
    runs = (
        ValidationRun.objects.filter(status=ValidationRun.Status.DONE)
        .order_by("-created_at")
        .values("created_at", "recall", "mean_score", "events_evaluated", "hits")[:limit]
    )
    # Fetched newest-first for the LIMIT, returned oldest-first for the chart.
    return list(runs)[::-1]
