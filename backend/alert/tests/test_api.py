from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from alert.models import Notification

from .factories import make_barangay


class NotificationApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user("resident", password="pw")
        self.other = get_user_model().objects.create_user("other", password="pw")
        self.barangay = make_barangay()
        self.n1 = Notification.objects.create(
            user=self.user, barangay=self.barangay, category="critical", title="A", body="b"
        )
        Notification.objects.create(
            user=self.other, barangay=self.barangay, category="critical", title="X", body="b"
        )
        self.client.force_authenticate(self.user)

    def test_requires_auth(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get(reverse("notification-list")).status_code, 401)

    def test_lists_only_own_notifications(self):
        resp = self.client.get(reverse("notification-list"))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["count"], 1)

    def test_mark_read(self):
        resp = self.client.post(reverse("notification-read", args=[self.n1.id]))
        self.assertEqual(resp.status_code, 200)
        self.n1.refresh_from_db()
        self.assertTrue(self.n1.is_read)

    def test_read_all(self):
        Notification.objects.create(
            user=self.user, barangay=self.barangay, category="high", title="B", body="b"
        )
        resp = self.client.post(reverse("notification-read-all"))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(Notification.objects.filter(user=self.user, is_read=False).count(), 0)

    def test_unread_count_scoped_to_user(self):
        # self.user has one unread (n1); another read one must not count.
        Notification.objects.create(
            user=self.user, barangay=self.barangay, category="low", title="C", body="b", is_read=True
        )
        resp = self.client.get(reverse("notification-unread-count"))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["count"], 1)
