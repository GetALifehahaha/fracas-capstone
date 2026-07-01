from django.contrib import admin

from .models import RiskConfig, RiskScore, ValidationRun


@admin.register(RiskConfig)
class RiskConfigAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "created_at")
    list_filter = ("is_active",)


@admin.register(RiskScore)
class RiskScoreAdmin(admin.ModelAdmin):
    list_display = ("barangay", "category", "score", "is_degraded", "computed_at")
    list_filter = ("category", "is_degraded")
    search_fields = ("barangay__name",)
    readonly_fields = ("barangay", "score", "category", "breakdown", "is_degraded", "config", "computed_at")
    date_hierarchy = "computed_at"


@admin.register(ValidationRun)
class ValidationRunAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "events_evaluated", "hits", "recall", "created_by", "created_at")
    list_filter = ("status",)
    readonly_fields = tuple(f.name for f in ValidationRun._meta.fields) + ("details",)
