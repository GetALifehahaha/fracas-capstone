"""Rainfall hazard: current + short-term forecast intensity (PAGASA-normalized).

Leans cautious for early warning — uses the peak expected intensity across
now + the next 4 hours. Multi-hour accumulation (soil saturation) is a
Phase-1 addition and will fold in here.
"""

from risk_score.constants import FACTOR_RAINFALL
from risk_score.services.normalization import normalize_rainfall

from .base import FactorInput, FactorResult


class RainfallFactor:
    key = FACTOR_RAINFALL

    def evaluate(self, data: FactorInput) -> FactorResult:
        r = data.rainfall
        if r is None:
            return FactorResult(self.key, 0.0, available=False, detail={"reason": "no rainfall reading"})

        forecasts = [
            r.forecast_strength_1hr,
            r.forecast_strength_2hr,
            r.forecast_strength_3hr,
            r.forecast_strength_4hr,
        ]
        peak_forecast = max(forecasts)
        peak_intensity = max(r.current_rainfall_strength, peak_forecast)
        value = normalize_rainfall(peak_intensity)

        return FactorResult(
            self.key,
            value,
            detail={
                "current_mm_hr": r.current_rainfall_strength,
                "peak_forecast_mm_hr": peak_forecast,
                "peak_intensity_mm_hr": peak_intensity,
            },
        )
