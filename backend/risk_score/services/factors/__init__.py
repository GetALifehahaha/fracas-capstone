from .base import FactorInput, FactorResult, RiskFactor
from .dam import DamFactor
from .elevation import ElevationVulnerabilityFactor
from .rainfall import RainfallFactor

# Order is cosmetic (breakdown display); weights come from RiskConfig.
DEFAULT_FACTORS: list[RiskFactor] = [
    RainfallFactor(),
    DamFactor(),
    ElevationVulnerabilityFactor(),
]

__all__ = [
    "FactorInput",
    "FactorResult",
    "RiskFactor",
    "RainfallFactor",
    "DamFactor",
    "ElevationVulnerabilityFactor",
    "DEFAULT_FACTORS",
]
