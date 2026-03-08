from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from optio.organizations.api.views import BaseOrganizationAPIView
from optio.organizations.api.permissions import (
    IsOrganizationAdmin,
    IsOrganizationMember
)
from optio.permissions import MethodPermissionMixin
from optio.users.api.actions import UserAPIAction


class UserAPIView(BaseOrganizationAPIView, MethodPermissionMixin):
    permission_classes_by_method = {
        "GET": [IsAuthenticated, IsOrganizationMember],
        "POST": [IsAuthenticated, IsOrganizationAdmin],
        "PATCH": [IsAuthenticated, IsOrganizationMember],
        "DELETE": [IsAuthenticated, IsOrganizationAdmin],
    }

    def get(self, request, organization_id, user_id=None):
        action: UserAPIAction = UserAPIAction(
            request.user,
            request.organization,
            request.membership
        )

        if user_id:
            users = action.get_user(user_id)
        else:
            users = action.list_users()

        return Response(users, status=status.HTTP_200_OK)

    def post(self, request, organization_id):
        action: UserAPIAction = UserAPIAction(
            request.user,
            request.organization,
            request.membership
        )
        user = action.create_user(request.data)

        return Response(user, status=status.HTTP_201_CREATED)

    def patch(self, request, organization_id, user_id):
        action: UserAPIAction = UserAPIAction(
            request.user,
            request.organization,
            request.membership
        )
        user = action.update_user(user_id, request.data)

        return Response(user, status=status.HTTP_200_OK)

    def delete(self, request, organization_id, user_id):
        action: UserAPIAction = UserAPIAction(
            request.user,
            request.organization,
            request.membership
        )
        action.remove_user(user_id)

        return Response(
            {"message": "User deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
