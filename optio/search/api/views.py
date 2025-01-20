from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from optio.tasks.api.actions.query import TaskESQuery

import logging

task_es_query = TaskESQuery()


class SearchTaskAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        try:
            task_es_query.execute(request.data)
            return Response({"msg": "Sent request to search task"}, status =
            status.HTTP_200_OK)
        except Exception as e:
            logging.info("error : %s", str(e))
            return Response({"msg": "Internal server error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SearchProjectAPIView(APIView):
    pass


class SearchAssigneeAPIView(APIView):
    pass
