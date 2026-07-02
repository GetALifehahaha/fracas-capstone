from django.contrib import admin

from .models import AlertEvent, AlertState, Notification, NotificationLog


@admin.register(AlertEvent)
class AlertEventAdmin(admin.ModelAdmin):
    list_display = (
        "created_at", "barangay", "kind", "level", "source",
        "recipients", "suppressed", "triggered_by",
    )
    list_filter = ("kind", "source", "level", "suppressed")
    search_fields = ("barangay__name", "dispatch_key")
    readonly_fields = [f.name for f in AlertEvent._meta.fields]

    def has_add_permission(self, request):
        return False  # append-only audit log; written by the system


@admin.register(AlertState)
class AlertStateAdmin(admin.ModelAdmin):
    list_display = ("barangay", "level", "is_suppressed", "entered_at", "last_notified_at")
    list_filter = ("level", "is_suppressed")
    list_editable = ("is_suppressed",)  # operator suppression override


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "category", "is_read", "created_at")
    list_filter = ("category", "is_read")


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ("channel", "user", "status", "created_at")
    list_filter = ("channel", "status")
