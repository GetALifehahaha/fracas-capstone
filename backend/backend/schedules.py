"""Celery Beat schedule.

Single source of truth for periodic tasks. As the ingest -> compute -> alert
pipeline lands, add its entries here so scheduling stays in one place.
"""

from celery.schedules import crontab

BEAT_SCHEDULE = {
    "scoring-pipeline-hourly": {
        # Chains: fetch rainfall -> compute risk scores (so compute runs on
        # fresh data). Open-Meteo and the ZCWD dam page both refresh hourly;
        # run a few minutes past the hour so upstream data is settled.
        "task": "risk_score.tasks.run_scoring_pipeline",
        "schedule": crontab(minute=5),
    },
}
