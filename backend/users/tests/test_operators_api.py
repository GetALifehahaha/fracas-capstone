from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase


class OperatorListApiTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.resident = User.objects.create_user("resident", password="pw")
        self.operator = User.objects.create_user(
            "operator", password="pw", is_operator=True, first_name="Ops", last_name="Lead"
        )
        self.admin = User.objects.create_user("admin", password="pw", is_staff=True)

    def test_resident_is_forbidden(self):
        self.client.force_authenticate(self.resident)
        resp = self.client.get(reverse("operator-list"))
        self.assertEqual(resp.status_code, 403)

    def test_returns_operators_and_admins_as_id_name(self):
        self.client.force_authenticate(self.operator)
        resp = self.client.get(reverse("operator-list"))
        self.assertEqual(resp.status_code, 200)
        names = {row["name"] for row in resp.data}
        self.assertIn("Ops Lead", names)  # full name preferred
        self.assertIn("admin", names)  # falls back to username
        self.assertNotIn("resident", names)
        self.assertEqual(set(resp.data[0].keys()), {"id", "name"})
