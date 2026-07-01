"""Celery Beat schedule.

Single source of truth for periodic tasks. As the ingest -> compute -> alert
pipeline lands, add its entries here so scheduling stays in one place.
"""

from celery.schedules import crontab

BEAT_SCHEDULE = {
    "fetch-rainfall-hourly": {
        "task": "rainfall_fetch.tasks.fetch_rainfall_information",
        # Open-Meteo and the ZCWD dam page both refresh hourly; run a few
        # minutes past the hour so upstream data is settled.
        "schedule": crontab(minute=5),
    },
}
