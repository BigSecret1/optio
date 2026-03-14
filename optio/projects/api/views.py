from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from optio.permissions import MethodPermissionMixin
from optio.projects.api.actions import ProjectUserAPIAction, ProjectAPIAction
from optio.organizations.api.permissions import (
    IsOrganizationMember,
    IsOrganizationAdmin
)
from optio.organizations.api.views import BaseOrganizationAPIView


class ProjectAPIView(BaseOrganizationAPIView, MethodPermissionMixin):
    permission_classes_by_method = {
        "POST": [IsAuthenticated, IsOrganizationAdmin],
        "GET": [IsAuthenticated, IsOrganizationMember],
        "PATCH": [IsAuthenticated, IsOrganizationAdmin],
        "DELETE": [IsAuthenticated, IsOrganizationAdmin],
    }

    def post(self, request, organization_id=None):
        action: ProjectAPIAction = ProjectAPIAction(request.organization)
        return Response(
            action.create_project(request.data),
            status=status.HTTP_201_CREATED
        )

    def get(self, request, organization_id=None, project_id=None):
        action: ProjectAPIAction = ProjectAPIAction(request.organization)

        if not project_id:
            return Response(action.list_projects())

        return Response(action.get_project(project_id))

    def patch(self, request, organization_id=None, project_id=None):
        action: ProjectAPIAction = ProjectAPIAction(request.organization)
        return Response(
            action.update_project(project_id, request.data)
        )

    def delete(self, request, organization_id=None, project_id=None):
        action: ProjectAPIAction = ProjectAPIAction(request.organization)
        return Response(
            action.delete_project(project_id),
            status=status.HTTP_204_NO_CONTENT
        )


class ProjectUsersAPIView(BaseOrganizationAPIView, MethodPermissionMixin):
    permission_classes_by_method = {
        "GET": [IsAuthenticated, IsOrganizationMember],
        "POST": [IsAuthenticated, IsOrganizationAdmin],
    }

    def get(self, request, organization_id, project_id):
        action: ProjectUserAPIAction = ProjectUserAPIAction(request.organization)
        return Response(
            action.get_project_users(project_id)
        )

    def post(self, request, organization_id, project_id):
        action = ProjectUserAPIAction(request.organization)

        return Response({
            "data": action.assign_users(
                project_id=project_id,
                user_ids=request.data.get("user_ids"),
            )
        })
