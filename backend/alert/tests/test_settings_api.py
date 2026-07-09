"""Alerting Policy settings endpoint plus the consumers it re-points:
the alert state machine (trigger band / all-clear), the broadcast kill-switch,
and the org-configurable message footer."""

from datetime import timedelta
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from django.core.cache import cache
from rest_framework.test import APITestCase

from alert.models import AlertingPolicy
from alert.services.evaluation import evaluate
from monitoring.models import OperationalToggles, OrganizationSettings
from risk_score.constants import RiskCategory

from .factories import make_barangay, make_score

User = get_user_model()


class _CacheIsolatedAPITestCase(APITestCase):
    """Redis persists across tests; keep singleton `.cached()` reads isolated."""

    def setUp(self):
        super().setUp()
        cache.clear()
        self.addCleanup(cache.clear)


class AlertingPolicyApiTests(_CacheIsolatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.resident = User.objects.create_user("resident", password="pw")
        self.admin = User.objects.create_user("admin", password="pw", is_staff=True)
        self.url = reverse("admin-settings-alerting")

    def test_resident_forbidden(self):
        self.client.force_authenticate(self.resident)
        self.assertEqual(self.client.get(self.url).status_code, 403)

    def test_defaults_match_todays_behaviour(self):
        self.client.force_authenticate(self.admin)
        resp = self.client.get(self.url)
        self.assertEqual(resp.data["trigger_category"], RiskCategory.CRITICAL.value)
        self.assertEqual(resp.data["renotify_interval_minutes"], 60)
        self.assertTrue(resp.data["send_all_clear"])

    def test_zero_renotify_rejected(self):
        self.client.force_authenticate(self.admin)
        resp = self.client.patch(self.url, {"renotify_interval_minutes": 0}, format="json")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("renotify_interval_minutes", resp.data)


class AlertingPolicyConsumerTests(_CacheIsolatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.barangay = make_barangay()
        self.dispatch = patch("alert.services.evaluation.dispatch", return_value=1).start()
        self.addCleanup(patch.stopall)

    def test_high_trigger_band_notifies_on_high_score(self):
        # Lower the trigger to HIGH; a HIGH score should now notify (CRITICAL-only wouldn't).
        policy = AlertingPolicy.get_solo()
        policy.trigger_category = AlertingPolicy.TriggerCategory.HIGH
        policy.save()

        make_score(self.barangay, RiskCategory.HIGH, when=timezone.now())
        self.assertEqual(evaluate()["notified"], 1)

    def test_default_critical_policy_ignores_high(self):
        make_score(self.barangay, RiskCategory.HIGH, when=timezone.now())
        self.assertEqual(evaluate()["notified"], 0)

    def test_all_clear_suppressed_when_disabled(self):
        policy = AlertingPolicy.get_solo()
        policy.send_all_clear = False
        policy.save()

        make_score(self.barangay, RiskCategory.CRITICAL, when=timezone.now() - timedelta(minutes=1))
        evaluate()
        make_score(self.barangay, RiskCategory.LOW, when=timezone.now())
        # Level still lowers, but no all-clear notification is sent.
        self.assertEqual(evaluate()["notified"], 0)


class BroadcastKillSwitchTests(_CacheIsolatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.operator = User.objects.create_user("operator", password="pw", is_operator=True)
        self.client.force_authenticate(self.operator)

    def test_broadcast_blocked_when_disabled(self):
        toggles = OperationalToggles.get_solo()
        toggles.broadcast_enabled = False
        toggles.save()
        # The toggle is checked before payload validation, so an empty body still 403s.
        resp = self.client.post(reverse("alert-broadcast"), {}, format="json")
        self.assertEqual(resp.status_code, 403)


class MessageFooterTests(_CacheIsolatedAPITestCase):
    def test_footer_uses_org_settings(self):
        from alert.services.messages import critical_message

        org = OrganizationSettings.get_solo()
        org.alert_footer = "— Zamboanga City DRRMO"
        org.save()
        _, body = critical_message("Tumaga", 92.0)
        self.assertIn("— Zamboanga City DRRMO", body)
