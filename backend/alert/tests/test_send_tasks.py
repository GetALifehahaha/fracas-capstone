from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase

from alert.constants import Channel, DeliveryStatus
from alert.models import NotificationLog
from alert.senders import SendError
from alert.tasks import send_sms_task


class SendTaskTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user("resident", password="pw")
        self.log = NotificationLog.objects.create(
            user=self.user, channel=Channel.SMS, dedup_key="k", status=DeliveryStatus.PENDING
        )

    def test_success_marks_sent(self):
        send_sms_task(self.user.id, "k", "+639170000001", "hello")  # console provider
        self.log.refresh_from_db()
        self.assertEqual(self.log.status, DeliveryStatus.SENT)

    def test_failure_marks_failed(self):
        with patch("alert.tasks.get_sms_provider") as provider:
            provider.return_value.send.side_effect = SendError("boom")
            send_sms_task(self.user.id, "k", "+63", "hi")
        self.log.refresh_from_db()
        self.assertEqual(self.log.status, DeliveryStatus.FAILED)
        self.assertIn("boom", self.log.detail)
