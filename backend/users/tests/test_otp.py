from django.contrib.auth import get_user_model
from django.test import TestCase

from users.models import PhoneOTP
from users.services.otp import OTPError, generate_and_send, verify


class OTPServiceTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            "resident", password="pw", phone_number="+639170000001"
        )

    def test_generate_then_verify_sets_verified(self):
        generate_and_send(self.user)  # console provider, no network
        code = PhoneOTP.objects.get(user=self.user).code
        verify(self.user, code)
        self.user.refresh_from_db()
        self.assertTrue(self.user.phone_verified)

    def test_no_phone_number_raises(self):
        self.user.phone_number = None
        self.user.save(update_fields=["phone_number"])
        with self.assertRaises(OTPError):
            generate_and_send(self.user)

    def test_resend_cooldown(self):
        generate_and_send(self.user)
        with self.assertRaises(OTPError):
            generate_and_send(self.user)  # immediate resend blocked

    def test_wrong_code_rejected(self):
        generate_and_send(self.user)
        with self.assertRaises(OTPError):
            verify(self.user, "000000")
        self.user.refresh_from_db()
        self.assertFalse(self.user.phone_verified)
