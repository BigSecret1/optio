from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from optio.users.api.actions import AuthAPIAction


class LoginAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        action = AuthAPIAction()
        result = action.login_user(request.data)

        return Response(result, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            raise ValidationError("Refresh token is required")

        action = AuthAPIAction()
        result = action.logout_user(refresh_token)

        return Response(result, status=status.HTTP_200_OK)
