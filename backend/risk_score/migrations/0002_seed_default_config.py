"""Seed one active RiskConfig so the admin shows a tunable default.

Scoring already falls back to in-memory defaults when none is active; this
just makes the active configuration visible and editable to operators.
"""

from django.db import migrations

# Inlined (not imported from app code) so this migration is self-contained.
WEIGHTS = {"rainfall": 0.5, "dam": 0.3, "vulnerability": 0.2}
THRESHOLDS = {"medium": 25.0, "high": 50.0, "critical": 75.0}


def seed(apps, schema_editor):
    RiskConfig = apps.get_model("risk_score", "RiskConfig")
    if not RiskConfig.objects.filter(is_active=True).exists():
        RiskConfig.objects.create(
            name="Default", is_active=True, weights=WEIGHTS, thresholds=THRESHOLDS
        )


def unseed(apps, schema_editor):
    RiskConfig = apps.get_model("risk_score", "RiskConfig")
    RiskConfig.objects.filter(name="Default").delete()


class Migration(migrations.Migration):
    dependencies = [("risk_score", "0001_initial")]
    operations = [migrations.RunPython(seed, unseed)]
