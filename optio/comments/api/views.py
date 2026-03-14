from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from optio.organizations.api.views import BaseOrganizationAPIView
from optio.organizations.api.permissions import IsOrganizationMember
from optio.permissions import MethodPermissionMixin
from optio.comments.api.actions import CommentAPIAction


class CommentAPIView(BaseOrganizationAPIView, MethodPermissionMixin):
    permission_classes_by_method = {
        "GET": [IsAuthenticated, IsOrganizationMember],
        "POST": [IsAuthenticated, IsOrganizationMember],
        "PATCH": [IsAuthenticated, IsOrganizationMember],
        "DELETE": [IsAuthenticated, IsOrganizationMember],
    }

    def get(self, request, organization_id=None, task_id=None, comment_id=None):
        action = CommentAPIAction(request.organization, request.user)

        if comment_id:
            return Response(action.get_comment(comment_id))

        return Response(action.list_comments(task_id))

    def post(self, request, organization_id=None, task_id=None):
        action = CommentAPIAction(request.organization, request.user)

        return Response(action.create_comment(task_id, request.data), status=201
                        )

    def patch(self, request, organization_id=None, comment_id=None):
        action = CommentAPIAction(request.organization, request.user)

        return Response(action.update_comment(comment_id, request.data))

    def delete(self, request, organization_id=None, comment_id=None):
        action = CommentAPIAction(request.organization, request.user)

        return Response(action.delete_comment(comment_id), status=204)
