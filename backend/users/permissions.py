"""Web-console role gates.

Two roles beyond a plain authenticated resident:

- **Operator** (`is_operator`) — runs the DRRMO console (broadcasts, monitoring)
  but is kept out of the Django admin site.
- **Admin** (`is_staff`) — full system access, including `/admin/`.

Admins are a superset of operators, so `IsOperator` also admits admins. These
mirror `User.role`; the API stays the real, server-enforced gate (the JWT
`role` claim is only a UX signal for the client).
"""

from rest_framework.permissions import BasePermission


class IsOperator(BasePermission):
    """Allow DRRMO operators and admins; reject residents and anonymous users."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_operator or user.is_staff or user.is_superuser)
        )


class IsAdmin(BasePermission):
    """Allow system administrators only (Django admin-site users)."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user and user.is_authenticated and (user.is_staff or user.is_superuser)
        )
