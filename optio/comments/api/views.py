from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView

from django.core.exceptions import ValidationError

import logging

from comments.api.actions import CommentAPIAction


comment_api_action = CommentAPIAction()


class CreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request : Request) -> Response:
        try:
            return Response(comment_api_action.add_comment(request.data), status = status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.error("%s exception occured while adding comment", str(e))
            return Response({"error": "Internal server error"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


