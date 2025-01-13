from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import NotFound

from optio.tasks.api.actions import TaskAPIAction, TaskActionManager

from django.http import JsonResponse

import logging

task_action_manager = TaskActionManager(TaskAPIAction())


class CreateTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        logging.info("Received client request to create a new task")
        logging.info(task_action_manager)
        try:
            return Response(task_action_manager.perform_create(request.data),
                            status=status.HTTP_200_OK)
        except ValidationError as e:
            logging.error("%s exception occured while creating task", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.error("%s exception occured while creating task", e)
            return Response({"error": "wrong request body"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetTasks(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
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
        try:
            return Response(task_action_manager.perform_fetch(task_id),
                            status=status.HTTP_200_OK)
        except Exception as e:
            logging.error("%s exception occured while fetching task with id %s", str(e),
                          task_id)
            return Response({"error": "Internal server error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request: Request, task_id: int) -> Response:
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
        try:
            task_action_manager.perform_delete(task_id)
            return Response({"message": "Deleted task successfully!!!"},
                            status=status.HTTP_200_OK)
        except NotFound as e:
            return Response({"error": f"Task with id {task_id} doesn't exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.error("Error deleting task: %s", e)
            return JsonResponse({"error": "Failed to delete task"}, status=500)
