"""Small shared builders for alert tests."""

from django.contrib.gis.geos import MultiPolygon, Polygon
from django.utils import timezone

from barangays.models import Barangay
from risk_score.constants import RiskCategory
from risk_score.models import RiskScore


def make_barangay(name="Tumaga", code="T1"):
    poly = Polygon(((0, 0), (0, 1), (1, 1), (1, 0), (0, 0)))
    return Barangay.objects.create(
        name=name, code=code, province_code="PH0907332", boundary=MultiPolygon(poly)
    )


def make_score(barangay, category, when=None, score=80.0):
    return RiskScore.objects.create(
        barangay=barangay,
        score=score,
        category=category,
        computed_at=when or timezone.now(),
    )
