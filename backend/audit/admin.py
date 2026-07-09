from django.contrib import admin

from .models import ConfigChangeLog


@admin.register(ConfigChangeLog)
class ConfigChangeLogAdmin(admin.ModelAdmin):
    list_display = ("changed_at", "target", "field", "actor")
    list_filter = ("target",)
    search_fields = ("target", "field", "new_value")
    readonly_fields = ("actor", "target", "action", "field", "old_value", "new_value", "changed_at")
