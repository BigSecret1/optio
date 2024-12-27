from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime

from tasks.serializers import SubTaskSerializer
from tasks.services import TaskOperation

from utils.db_manager import create_connection, close_connection

import logging
logging.basicConfig(level=logging.DEBUG)


class CreateSubTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def __init__(self):
        self.conn, self.cur = create_connection()
        self.task_operation = TaskOperation(self.cur, self.conn);

    def post(self, request):
        try:
            serializer = SubTaskSerializer(data=request.data)
            if serializer.is_valid():
                task_data = serializer.validated_data

                self.task_operation.create_sub_task(task_data)

                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=400)
        except Exception as err:
            logging.error("An error occured while creating subtask %s", err)
            return Response({"error": "wrong request body"}, status=status.HTTP_400_BAD_REQUEST)
        finally:
            logging.info("Closing database connection")
            close_connection(self.cur, self.conn)
