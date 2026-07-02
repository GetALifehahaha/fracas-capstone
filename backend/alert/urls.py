from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AlertEventListView, BroadcastView, NotificationViewSet

router = DefaultRouter()
router.register(r"notifications", NotificationViewSet, basename="notification")
router.register(r"alerts/events", AlertEventListView, basename="alert-event")

urlpatterns = router.urls + [
    path("admin/broadcasts/", BroadcastView.as_view(), name="alert-broadcast"),
]
