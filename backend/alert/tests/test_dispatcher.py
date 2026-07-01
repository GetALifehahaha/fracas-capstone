from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase

from alert.constants import Channel
from alert.models import Notification, NotificationLog
from alert.services.dispatcher import dispatch
from risk_score.constants import RiskCategory
from users.models import Device, Subscription

from .factories import make_barangay


class DispatcherTests(TestCase):
    def setUp(self):
        self.barangay = make_barangay()
        self.user = get_user_model().objects.create_user(
            "resident", password="pw", phone_number="+639170000001", phone_verified=True
        )
        Subscription.objects.create(user=self.user, barangay=self.barangay)
        # Patch async send enqueues so tests don't need a worker.
        self.sms = patch("alert.tasks.send_sms_task.delay").start()
        self.push = patch("alert.tasks.send_push_task.delay").start()
        self.addCleanup(patch.stopall)

    def _dispatch(self, key="k1"):
        dispatch(self.barangay, RiskCategory.CRITICAL, 82.0, key)

    def test_inapp_and_sms_for_verified_subscriber(self):
        self._dispatch()
        self.assertEqual(Notification.objects.filter(user=self.user).count(), 1)
        self.assertTrue(NotificationLog.objects.filter(user=self.user, channel=Channel.INAPP).exists())
        self.assertTrue(NotificationLog.objects.filter(user=self.user, channel=Channel.SMS).exists())
        self.sms.assert_called_once()

    def test_idempotent_on_same_dispatch_key(self):
        self._dispatch("dup")
        self._dispatch("dup")  # re-run same episode
        self.assertEqual(Notification.objects.filter(user=self.user).count(), 1)
        self.assertEqual(self.sms.call_count, 1)

    def test_unverified_phone_gets_no_sms(self):
        self.user.phone_verified = False
        self.user.save(update_fields=["phone_verified"])
        self._dispatch()
        self.assertFalse(NotificationLog.objects.filter(channel=Channel.SMS).exists())
        self.sms.assert_not_called()

    def test_push_enqueued_per_active_device(self):
        Device.objects.create(user=self.user, token="tok-abc", platform="android")
        self._dispatch()
        self.push.assert_called_once()
        self.assertTrue(NotificationLog.objects.filter(channel=Channel.PUSH).exists())
