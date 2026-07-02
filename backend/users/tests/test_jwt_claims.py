from django.contrib.auth import get_user_model
from django.test import TestCase

from users.serializers_jwt import RoleTokenObtainPairSerializer


class JwtClaimTests(TestCase):
    """The web console gates UI on the JWT's `role` claim."""

    def _token_for(self, **kwargs):
        user = get_user_model().objects.create_user("op", password="pw", **kwargs)
        return RoleTokenObtainPairSerializer.get_token(user)

    def test_refresh_token_carries_role_claims(self):
        token = self._token_for(is_staff=True)
        self.assertEqual(token["role"], "admin")
        self.assertEqual(token["username"], "op")

    def test_claims_are_copied_onto_the_access_token(self):
        # The client reads the access token, not the refresh token.
        access = self._token_for(is_operator=True).access_token
        self.assertEqual(access["role"], "operator")
        self.assertEqual(access["username"], "op")

    def test_admin_beats_operator(self):
        # is_staff (admin-site access) outranks the operator flag.
        access = self._token_for(is_staff=True, is_operator=True).access_token
        self.assertEqual(access["role"], "admin")

    def test_plain_user_is_resident(self):
        access = self._token_for().access_token
        self.assertEqual(access["role"], "resident")
