from types import SimpleNamespace

from django.test import SimpleTestCase

from risk_score.services.factors import (
    DamFactor,
    ElevationVulnerabilityFactor,
    FactorInput,
    RainfallFactor,
)


def rainfall(current=0.0, f1=0.0, f2=0.0, f3=0.0, f4=0.0):
    return SimpleNamespace(
        current_rainfall_strength=current,
        forecast_strength_1hr=f1,
        forecast_strength_2hr=f2,
        forecast_strength_3hr=f3,
        forecast_strength_4hr=f4,
    )


class RainfallFactorTests(SimpleTestCase):
    def test_uses_peak_intensity(self):
        data = FactorInput(None, rainfall(current=0.0, f1=15.0), SimpleNamespace())
        result = RainfallFactor().evaluate(data)
        self.assertTrue(result.available)
        self.assertAlmostEqual(result.value, 0.66)  # 15 mm/hr -> orange band

    def test_missing_reading_is_unavailable(self):
        result = RainfallFactor().evaluate(FactorInput(None, None, SimpleNamespace()))
        self.assertFalse(result.available)
        self.assertEqual(result.value, 0.0)


class ElevationFactorTests(SimpleTestCase):
    def test_low_lying_is_more_vulnerable(self):
        ctx = SimpleNamespace(elevation_bounds=(0.0, 10.0))
        low = ElevationVulnerabilityFactor().evaluate(
            FactorInput(SimpleNamespace(land_height_mean=1.0), None, ctx)
        )
        high = ElevationVulnerabilityFactor().evaluate(
            FactorInput(SimpleNamespace(land_height_mean=9.0), None, ctx)
        )
        self.assertGreater(low.value, high.value)
        self.assertAlmostEqual(low.value, 0.9)

    def test_missing_elevation_is_unavailable(self):
        ctx = SimpleNamespace(elevation_bounds=(0.0, 10.0))
        result = ElevationVulnerabilityFactor().evaluate(
            FactorInput(SimpleNamespace(land_height_mean=None), None, ctx)
        )
        self.assertFalse(result.available)


class DamFactorTests(SimpleTestCase):
    def test_unavailable_until_phase_1(self):
        result = DamFactor().evaluate(FactorInput(None, None, SimpleNamespace(dam_reading=None)))
        self.assertFalse(result.available)
