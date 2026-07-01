"""Latest risk snapshot cached in Redis.

Clients read this one payload instead of hitting the DB/compute path, so map
loads stay fast. Rewritten each compute cycle; carries a TTL as a safety net
so a dead pipeline eventually surfaces as "no data" rather than stale data.
"""

from __future__ import annotations

from datetime import datetime

from django.core.cache import cache

SNAPSHOT_KEY = "risk:snapshot:latest"
SNAPSHOT_TTL = 60 * 60 * 3  # 3h — longer than the hourly cycle, short enough to expire staleness


def store(computed_at: datetime, entries: list[dict]) -> dict:
    payload = {
        "computed_at": computed_at.isoformat(),
        "count": len(entries),
        "barangays": entries,
    }
    cache.set(SNAPSHOT_KEY, payload, timeout=SNAPSHOT_TTL)
    return payload


def read() -> dict | None:
    return cache.get(SNAPSHOT_KEY)
