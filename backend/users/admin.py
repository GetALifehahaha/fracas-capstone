from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User

extra = ("Contact & alerting", {"fields": ("phone_number", "phone_verified")})


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (extra,)
    list_display = ("username", "email", "phone_number", "phone_verified", "is_staff")
