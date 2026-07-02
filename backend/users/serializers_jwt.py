from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RoleTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Embeds the console ``role`` (+ username) into the JWT.

    The web console holds the short-lived access token in memory and gates UI on
    ``role`` (``resident`` / ``operator`` / ``admin``) without an extra request.
    SimpleJWT copies these custom claims onto refreshed access tokens too, so the
    role survives the whole refresh session.

    This is a **UX signal only** — the role-gated endpoints (broadcasts,
    validation runs) remain the real, server-enforced gate.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["username"] = user.get_username()
        return token
