from django.contrib.auth.middleware import get_user
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError, PermissionDenied

from optio.users.models import UserProfile
from optio.organizations.models import Membership, Organization
from optio.users.api.serializers import UserSerializer
from optio.organizations.api.serializers import OrganizationUserSerializer


class UserAPIAction:

    def __init__(
            self,
            user: UserProfile,
            organization: Organization,
            membership: Membership
    ):
        self.user = user
        self.organization = organization
        self.membership = membership

    def __is_only_admin(self, membership: Membership) -> bool:
        admin_count: int = Membership.objects.filter(
            organization=self.organization,
            role=Membership.Role.ADMIN
        ).count()

        return membership.is_admin and admin_count == 1

    def __get_user_membership(self, user_id: int, organization: Organization):
        membership = Membership.objects.get(
            user_id=user_id,
            organization=self.organization
        )
        return membership

    def _require_admin(self):
        if not self.membership.is_admin:
            raise PermissionDenied("Admin permission required")

    def list_users(self):
        self._require_admin()

        memberships = Membership.objects.select_related("user").filter(
            organization=self.organization
        )

        return OrganizationUserSerializer(memberships, many=True).data

    def get_user(self, user_id: int):
        user = get_object_or_404(
            UserProfile,
            pk=user_id,
            memberships__organization=self.organization
        )
        membership = self.__get_user_membership(user_id, self.organization)

        return UserSerializer(user, context={"membership": membership}).data

    def create_user(self, data: dict):
        """
            - If User doesn't exit : Create & Add to Organization
            - If User already exists
                - Not in Organization : Add to Organization
                - Already inside organization : Notify(Already exist)
        """

        self._require_admin()

        email: str = data.get("email")

        if not email:
            raise ValidationError("Email is required")

        role = data.get('role', Membership.Role.MEMBER)

        user = UserProfile.objects.filter(email=email).first()

        if not user:

            password: str = data.get("password")

            if not password:
                raise ValidationError("Password required for new user")

            user = UserProfile.objects.create_user(
                email=email,
                password=password,
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", "")
            )

        membership, created = Membership.objects.get_or_create(
            user=user,
            organization=self.organization,
            defaults={"role": role}
        )

        if not created:
            raise ValidationError("User already belongs to this organization")

        return UserSerializer(user,  context={"membership": membership}).data

    def update_user(self, user_id: int, data: dict):
        """
        User must be Admin or the account owner.
        """

        user: UserProfile = get_object_or_404(UserProfile, pk=user_id)
        membership: Membership = get_object_or_404(
            Membership,
            user_id=user_id,
            organization=self.organization
        )

        if self.user != user and not self.membership.is_admin:
            raise PermissionDenied('You must be account owner or have Admin access')

        if data.get('role'):
            self._require_admin()
            membership.role = data['role']
            membership.save()

        serializer: UserSerializer = UserSerializer(
            user,
            context={"membership": membership},
            data=data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return serializer.data

    def remove_user(self, user_id: int):
        self._require_admin()

        user: UserProfile = get_object_or_404(UserProfile, pk=user_id)
        membership: Membership = get_object_or_404(
            Membership,
            user_id=user_id,
            organization=self.organization
        )

        if self.__is_only_admin(membership):
            raise PermissionDenied('An Organization must have atleast one Admin')

        membership.delete()

        return {"message": "User removed from organization"}
