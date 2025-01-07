from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

import logging

from comments.api.actions import CommentAPIAction


comment_api_action = CommentAPIAction


class CreateView:
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, task_id : int, request : Request) -> Response:
        try:
            return Response(comment_api_action.add_comment(task_id, request.data), status = status.HTTP_200_OK)
        except Exception as e:
            logging.error("Failed to add the comment under task ")

