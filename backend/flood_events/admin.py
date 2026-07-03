from django.contrib import admin

from .models import (
    AutoDetectConfig,
    FloodEvent,
    FloodEventChange,
    FloodEventTimelineEntry,
)


class FloodEventTimelineInline(admin.TabularInline):
    model = FloodEventTimelineEntry
    extra = 1
    ordering = ("occurred_at",)


class FloodEventChangeInline(admin.TabularInline):
    model = FloodEventChange
    extra = 0
    can_delete = False
    ordering = ("-changed_at",)
    readonly_fields = ("editor", "action", "field", "old_value", "new_value", "changed_at")

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(FloodEvent)
class FloodEventAdmin(admin.ModelAdmin):
    list_display = (
        "barangay",
        "occurred_at",
        "ended_at",
        "severity",
        "source_kind",
        "is_confirmed",
        "deleted_at",
        "people_affected",
    )
    list_filter = ("severity", "source_kind", "is_confirmed")
    search_fields = ("barangay__name", "source")
    date_hierarchy = "occurred_at"
    inlines = [FloodEventTimelineInline, FloodEventChangeInline]


@admin.register(AutoDetectConfig)
class AutoDetectConfigAdmin(admin.ModelAdmin):
    list_display = ("enabled", "threshold_category", "updated_at")
