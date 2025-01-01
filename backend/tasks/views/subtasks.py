from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status

from utils.db_manager import create_connection, close_connection

import logging
logging.basicConfig(level=logging.DEBUG)

from tasks.api.actions.subtasks import FetchTasksAPIActin, CreateTaskAPIAction


fetch_tasks = FetchTasksAPIActin()
create_task = CreateTaskAPIAction()


class CreateSubTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request : Request) -> Response:
        try:
            return Response(create_task.execute(request.data), status = status.HTTP_200_OK)
        except Exception as e:
            logging.error("An error occured while creating subtask %s", e)
            return Response({"error": "Internal Server error"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetSubTasks(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request : Request, parent_task_id : int) -> Response:
        try:
            return Response(fetch_tasks.execute(parent_task_id), status = status.HTTP_200_OK)
        except Exception as error:
            logging.error("An error occured while fetching all subtask under task with id %d : %s ", parent_task_id, error)
            return Response({"error": "Server error"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
