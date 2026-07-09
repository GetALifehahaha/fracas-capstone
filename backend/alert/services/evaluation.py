"""Alert state machine with hysteresis.

Runs each cycle over the latest risk score per barangay:
  - not critical -> critical      => notify (entered)
  - critical -> critical          => re-notify only after RENOTIFY_INTERVAL
  - critical -> not critical      => notify (all-clear)
Only CRITICAL triggers resident alerts; the AlertState row is the memory that
keeps us from re-notifying every 15 minutes.
"""

from django.utils import timezone

from alert.constants import EventKind, EventSource
from alert.models import AlertEvent, AlertState, AlertingPolicy
from risk_score.models import RiskScore

from .dispatcher import dispatch


def _latest_scores():
    return (
        RiskScore.objects.order_by("barangay_id", "-computed_at")
        .distinct("barangay_id")
        .select_related("barangay")
    )


def evaluate() -> dict:
    policy = AlertingPolicy.cached()
    notified = 0
    for score in _latest_scores():
        state, _ = AlertState.objects.get_or_create(barangay=score.barangay)
        if _process(state, score, policy):
            notified += 1
    return {"notified": notified}


def _transition_kind(state: AlertState, score: RiskScore, now, policy) -> str | None:
    """The alert transition this cycle warrants, or None if nothing to notify."""
    was_triggered = policy.triggers(state.level)
    is_triggered = policy.triggers(score.category)

    if is_triggered and not was_triggered:
        return EventKind.ENTERED
    if is_triggered and was_triggered:
        due = state.last_notified_at is None or (now - state.last_notified_at) >= policy.renotify_interval
        return EventKind.RENOTIFY if due else None
    if was_triggered and not is_triggered:
        return EventKind.ALL_CLEAR if policy.send_all_clear else None
    return None


def _process(state: AlertState, score: RiskScore, policy) -> bool:
    now = timezone.now()
    kind = _transition_kind(state, score, now, policy)

    if score.category != state.level:
        state.level = score.category
        state.entered_at = now

    if kind is None:
        state.save()
        return False

    # Operator suppression mutes automated dispatch but still tracks the level
    # (so an all-clear/re-alert resumes correctly once un-suppressed) — and the
    # transition is still audited, just with no recipients.
    key = f"{score.barangay_id}:{score.computed_at.isoformat()}"
    recipients = 0
    if not state.is_suppressed:
        recipients = dispatch(
            score.barangay, score.category, score.score, key,
            all_clear=(kind == EventKind.ALL_CLEAR),
        )
        state.last_notified_at = now

    AlertEvent.objects.create(
        barangay=score.barangay,
        level=score.category,
        kind=kind,
        source=EventSource.AUTOMATED,
        score=score.score,
        recipients=recipients,
        suppressed=state.is_suppressed,
        dispatch_key=key,
    )
    state.save()
    return not state.is_suppressed
