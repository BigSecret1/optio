from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from optio.organizations.api.views import BaseOrganizationAPIView
from optio.organizations.api.permissions import (
    IsOrganizationAdmin,
    IsOrganizationMember
)
from optio.permissions import MethodPermissionMixin
from optio.tasks.api.actions import TaskAPIAction


class TaskAPIView(BaseOrganizationAPIView, MethodPermissionMixin):
    permission_classes_by_method = {
        "GET": [IsAuthenticated, IsOrganizationMember],
        "POST": [IsAuthenticated, IsOrganizationMember],
        "PATCH": [IsAuthenticated, IsOrganizationMember],
        "DELETE": [IsAuthenticated, IsOrganizationAdmin],
    }

    def get(self, request, organization_id=None, task_id=None):
        action = TaskAPIAction(request.organization)

        if task_id:
            return Response(action.get_task(task_id))

        project_id = request.query_params.get("project_id")
        if project_id:
            return Response(action.list_tasks(project_id))

        return Response({"detail": "project_id query parameter is required"}, status=400)

    def post(self, request, organization_id=None):
        action = TaskAPIAction(request.organization)
        return Response(
            action.create_task(request.data),
            status=201
        )

    def patch(self, request, organization_id=None, task_id=None):
        action = TaskAPIAction(request.organization)
        return Response(
            action.update_task(task_id, request.data)
        )

    def delete(self, request, organization_id=None, task_id=None):
        action = TaskAPIAction(request.organization)
        return Response(
            action.delete_task(task_id),
            status=204
        )
