from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

import logging

from optio.tasks.api.actions.query import TaskESQuery
from optio.projects.query import ProjectESQuery

task_es_query = TaskESQuery()
project_es_query = ProjectESQuery()


class SearchTaskAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        try:
            search_results = task_es_query.execute(request.data)
            return Response(search_results, status=status.HTTP_200_OK)
        except Exception as e:
            logging.info("error : %s", str(e))
            return Response(
                {"msg": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SearchProjectAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        try:
            search_results = project_es_query.execute(request.data)
            return Response(search_results, status=status.HTTP_200_OK)
        except Exception as e:
            logging.info("error : %s", str(e))
            return Response(
                {"msg": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SearchAssigneeAPIView(APIView):
    pass
