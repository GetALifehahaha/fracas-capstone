from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Device, NotificationPreference, Subscription, User

extra = ("Contact & alerting", {"fields": ("phone_number", "phone_verified")})


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (extra,)
    list_display = ("username", "email", "phone_number", "phone_verified", "is_staff")


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "barangay", "created_at")
    search_fields = ("user__username", "barangay__name")


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ("user", "platform", "is_active", "created_at")
    list_filter = ("platform", "is_active")


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "sms_enabled", "push_enabled", "inapp_enabled")
