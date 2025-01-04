from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import NotFound

from django.http import JsonResponse

import logging

from tasks.api.actions.task import (
    FetchTasksAPIAction,
    FetchTaskAPIAction,
    CreateTaskAPIAction,
    DeleteTaskAPIAction,
    UpdateTaskAPIAction
)


"""
This problem needs to be solved using a appropriate design patterns(Creational can help!!!)
"""
fetch_tasks = FetchTasksAPIAction()
fetch_task = FetchTaskAPIAction()
create_task = CreateTaskAPIAction()
delete_task = DeleteTaskAPIAction()
update_task = UpdateTaskAPIAction()


class CreateTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request : Request) -> Response:
        try:
            return Response(create_task.execute(request.data), status = status.HTTP_200_OK)
        except ValidationError as e:
            logging.error("%s exception occured while creating task", str(e))
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.error("%s exception occured while creating task", e)
            return Response({"error": "wrong request body"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetTasks(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request : Request) -> Response:
        try:
            project_id = request.GET.get("project_id")
            return Response(fetch_tasks.execute(project_id), status = status.HTTP_200_OK)
        except Exception as e:
            logging.error("%s occured while fetching tasks ", str(e))
            return JsonResponse({'ERROR': "Bad Request"}, status=500)


class GetTaskById(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request : Request, task_id : int) -> Response:
        try:
            return Response(fetch_task.execute(task_id), status = status.HTTP_200_OK)
        except Exception as e:
            logging.error("%s exception occured while fetching task with id %s", str(e), task_id)
            return Response({"error": "Internal server error"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request : Request, task_id : int) -> Response:
        try:
            return Response(update_task.execute(request.data, task_id), status = status.HTTP_200_OK)
        except NotFound:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)


class DeleteTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request : Request, task_id : int) -> Response:
        try:
            delete_task.execute(task_id)
            return Response({"message": "Deleted task successfully!!!"}, status = status.HTTP_200_OK)
        except NotFound as e:
            return Response({"error": f"Task with id {task_id} doesn't exist"}, status = status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.error("Error deleting task: %s", e)
            return JsonResponse({"error": "Failed to delete task"}, status=500)



