from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

from optio.users.api.serializers import UserSerializer
from optio.organizations.api.serializers import (
    MembershipSerializer,
    OrganizationSerializer
)
from optio.organizations.models import Organization, Membership


class AuthAPIAction:

    def login_user(self, data):
        email = data.get("email")
        password = data.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            raise ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        memberships = (
            Membership
            .objects
            .select_related("organization")
            .filter(user=user)
        )

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data,
            "organizations": MembershipSerializer(memberships, many=True).data
        }

    def logout_user(self, refresh_token):
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return {"message": "Logged out successfully"}

        except Exception:
            raise ValidationError("Invalid token")
