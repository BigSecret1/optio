from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

from tasks.serializers import SubTaskSerializer
from tasks.services import SubTaskOperations
from utils.db_manager import create_connection, close_connection

import logging
logging.basicConfig(level=logging.DEBUG)


conn, cur = create_connection()
sub_task_operations = SubTaskOperations(cur, conn);


class CreateSubTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = SubTaskSerializer(data=request.data)
            if serializer.is_valid():
                task_data = serializer.validated_data
                sub_task_operations.create_sub_task(task_data)

                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as err:
            logging.error("An error occured while creating subtask %s", err)
            return Response({"error": "Internal Server error"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            logging.info("Closing database connection")
            close_connection(cur, conn)


class GetSubTasks(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id : int):
        try:
            sub_tasks = sub_task_operations.get_sub_task(task_id)
            serializer = SubTaskSerializer(instance = sub_tasks, many = True, fields = ["id", "title", "project_id", "parent_task_id"])
            logging.info(serializer)
            return Response(serializer.data, status = status.HTTP_200_OK)
        except Exception as error:
            logging.error("An error occured while fetching all subtask under task with id %d ", task_id)
            return Response({"error": "Server error"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
