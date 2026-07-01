from django.test import SimpleTestCase

from risk_score.services.normalization import (
    clamp,
    normalize_position,
    normalize_rainfall,
    piecewise_linear,
)


class NormalizationTests(SimpleTestCase):
    def test_clamp_bounds(self):
        self.assertEqual(clamp(-1), 0.0)
        self.assertEqual(clamp(2), 1.0)
        self.assertEqual(clamp(0.5), 0.5)

    def test_piecewise_flat_past_ends(self):
        pts = [(0.0, 0.0), (10.0, 1.0)]
        self.assertEqual(piecewise_linear(-5, pts), 0.0)
        self.assertEqual(piecewise_linear(15, pts), 1.0)
        self.assertAlmostEqual(piecewise_linear(5, pts), 0.5)

    def test_normalize_rainfall_pagasa_bands(self):
        self.assertEqual(normalize_rainfall(0), 0.0)
        self.assertAlmostEqual(normalize_rainfall(7.5), 0.33)
        self.assertAlmostEqual(normalize_rainfall(15), 0.66)
        self.assertEqual(normalize_rainfall(30), 1.0)
        self.assertEqual(normalize_rainfall(100), 1.0)  # clamped

    def test_normalize_position_degenerate_range(self):
        self.assertEqual(normalize_position(5, 10, 10), 0.0)
        self.assertAlmostEqual(normalize_position(5, 0, 10), 0.5)
