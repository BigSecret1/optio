from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied

import logging

from optio.tasks.api.actions import SubTaskAPIAction, TaskActionManager
from optio.permissions import check_permission
from optio.utils.exceptions import perm_required_error

task_action_manager = TaskActionManager(SubTaskAPIAction())


class CreateSubTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        if not check_permission(request.user, "tasks", "Task", "add"):
            raise PermissionDenied(perm_required_error)

        try:
            return Response(
                task_action_manager.perform_create(request.data),
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            logging.error("%s exception occured while creating subtask", str(e))
            return Response({
                "error": "Invalid request body"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logging.error("An error occured while creating subtask %s", e)
            return Response(
                {"error": "Internal Server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetSubTasks(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, parent_task_id: int) -> Response:
        if not check_permission(request.user, "tasks", "Task", "view"):
            raise PermissionDenied(perm_required_error)

        try:
            return Response(
                task_action_manager.perform_fetch_all(parent_task_id),
                status=status.HTTP_200_OK
            )
        except Exception as error:
            logging.error(
                "An error occured while fetching all subtask under task with id %d : %s ",
                parent_task_id, error)
            return Response(
                {"error": "Internal Server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
