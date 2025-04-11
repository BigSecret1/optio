from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import NotFound, PermissionDenied

from optio.tasks.api.actions import TaskAPIAction, TaskActionManager
from optio.permissions import check_permission
from optio.utils.exceptions import perm_required_error
from optio.users.models import UserProfile, UserGroup
from optio.tasks.models import Task

from django.http import JsonResponse
from django.contrib.auth.models import Group

import logging

task_action_manager = TaskActionManager(TaskAPIAction())

app_label = Task._meta.app_label


class CreateTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        logging.info("Received request to create task")
        user = UserProfile.objects.get(email=request.user)
        if not check_permission(request.user, "tasks", "Task", "create"):
            raise PermissionDenied(perm_required_error)

        try:
            return Response(
                task_action_manager.perform_create(request.data),
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            logging.error("%s exception occured while creating task", str(e))
            return Response(
                {"error": "Invalid request body"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logging.error("%s exception occured while creating task", e)
            return Response(
                {"error": "wrong request body"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetTasks(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        user = UserProfile.objects.get(email=request.user)
        if not check_permission(request.user, "tasks", "Task", "view"):
            raise PermissionDenied(perm_required_error)

        try:
            project_id = request.GET.get("project_id")
            return Response(task_action_manager.perform_fetch_all(project_id),
                            status=status.HTTP_200_OK)
        except Exception as e:
            logging.error("%s occured while fetching tasks ", str(e))
            return JsonResponse({'ERROR': "Bad Request"}, status=500)


class GetTaskById(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, task_id: int) -> Response:
        user = UserProfile.objects.get(email=request.user)
        if not check_permission(request.user, "tasks", "Task", "view"):
            raise PermissionDenied(perm_required_error)

        try:
            return Response(
                task_action_manager.perform_fetch(task_id),
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logging.error(
                "%s exception occured while fetching task with id %s", str(e), task_id
            )
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UpdateTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request: Request, task_id: int) -> Response:
        user = UserProfile.objects.get(email=request.user)
        if not check_permission(request.user, "tasks", "Task", "change"):
            raise PermissionDenied(perm_required_error)

        try:
            return Response(task_action_manager.perform_update(task_id, request.data),
                            status=status.HTTP_200_OK)
        except NotFound:
            return Response({"error": "Task not found"},
                            status=status.HTTP_404_NOT_FOUND)


class DeleteTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request: Request, task_id: int) -> Response:
        user = UserProfile.objects.get(email=request.user)
        groups = Group.objects.filter(usergroup__user=user)

        logging.info("User is part of the groups")
        for group in groups:
            logging.info(group.name)

        if not check_permission(request.user, "tasks", "Task", "delete"):
            raise PermissionDenied(perm_required_error)

        try:
            task_action_manager.perform_delete(task_id)
            return Response({"message": "Deleted task successfully!!!"},
                            status=status.HTTP_200_OK)
        except NotFound as e:
            return Response({"error": f"Task with id {task_id} doesn't exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.error("Error deleting task: %s", e)
            return Response({"error": "Failed to delete the task"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
