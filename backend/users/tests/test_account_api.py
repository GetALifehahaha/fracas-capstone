from django.contrib.auth import get_user_model
from django.contrib.gis.geos import MultiPolygon, Polygon
from django.urls import reverse
from rest_framework.test import APITestCase

from barangays.models import Barangay
from users.models import Device, Subscription


def make_barangay(name="Tumaga", code="T1"):
    poly = Polygon(((0, 0), (0, 1), (1, 1), (1, 0), (0, 0)))
    return Barangay.objects.create(
        name=name, code=code, province_code="PH0907332", boundary=MultiPolygon(poly)
    )


class AccountApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user("resident", password="pw")
        self.barangay = make_barangay()
        self.client.force_authenticate(self.user)

    def test_subscribe_is_idempotent(self):
        url = reverse("subscription-list")
        self.assertEqual(self.client.post(url, {"barangay": self.barangay.id}).status_code, 201)
        self.client.post(url, {"barangay": self.barangay.id})  # again
        self.assertEqual(Subscription.objects.filter(user=self.user).count(), 1)

    def test_subscriptions_are_user_scoped(self):
        other = get_user_model().objects.create_user("other", password="pw")
        Subscription.objects.create(user=other, barangay=self.barangay)
        resp = self.client.get(reverse("subscription-list"))
        self.assertEqual(resp.data["count"], 0)

    def test_register_device_upserts_token(self):
        url = reverse("device-list")
        self.client.post(url, {"token": "tok-1", "platform": "android"})
        self.client.post(url, {"token": "tok-1", "platform": "ios"})  # same token
        self.assertEqual(Device.objects.filter(token="tok-1").count(), 1)
        self.assertEqual(Device.objects.get(token="tok-1").platform, "ios")

    def test_preferences_get_and_update(self):
        url = reverse("notification-preferences")
        self.assertEqual(self.client.get(url).status_code, 200)
        resp = self.client.patch(url, {"sms_enabled": False})
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.data["sms_enabled"])


class CurrentUserApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            "operator", password="pw", is_operator=True, first_name="Ops", last_name="Lead"
        )
        self.client.force_authenticate(self.user)

    def test_me_exposes_profile_and_role(self):
        resp = self.client.get(reverse("user-me"))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["first_name"], "Ops")
        self.assertEqual(resp.data["role"], "operator")  # derived, read-only
        self.assertEqual(resp.data["username"], "operator")

    def test_me_updates_editable_fields(self):
        resp = self.client.patch(
            reverse("user-me"), {"first_name": "Renamed", "email": "ops@drrmo.gov"}
        )
        self.assertEqual(resp.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Renamed")
        self.assertEqual(self.user.email, "ops@drrmo.gov")

    def test_me_cannot_self_promote_role(self):
        # `role` is read-only: PATCHing it must not touch the underlying flags.
        self.client.patch(reverse("user-me"), {"role": "admin"})
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)

    def test_set_password_changes_credentials(self):
        resp = self.client.post(
            reverse("user-set-password"),
            {"current_password": "pw", "new_password": "n3w-passphrase"},
        )
        self.assertEqual(resp.status_code, 204)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("n3w-passphrase"))
