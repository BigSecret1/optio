from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import NotFound, PermissionDenied

from django.contrib.auth.models import Group

import json
import logging

from optio.users.models import UserProfile, UserGroup
from optio.users.serializers import UserSerializer
from optio.permissions import check_permission
from optio.utils.exceptions import perm_required_error
from optio.users.actions.user import User

ROLES = ["Admin", "Alpha", "Beta", "Gamma"]
logger = logging.getLogger(__name__)

user_action = User()


class RegisterView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # If user doesn't belongs to Admin group then, it can't create new user
        if not (user.is_superuser or user.groups.filter(name="Admin").exists()):
            return Response(
                {
                    "error":
                        "Permission denied, only Admin or Superuser can create "
                        "new users"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        role = data.get("role", "Gamma")

        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if role not in ROLES:
            return Response(
                {"error": "User role doesn't exist"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = UserProfile.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        group = Group.objects.get(name=role)
        UserGroup.objects.create(user=user, group=group)

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        logger.info("[Auth] Received login request from user %s", email)
        user = authenticate(request, email=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": UserSerializer(user).data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_400_BAD_REQUEST
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            if not refresh_token:
                return Response(
                    {"msg": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"msg": "logged out successfully"},
                status=status.HTTP_205_RESET_CONTENT
            )
        except TokenError:
            return Response(
                {"msg": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"msg": "Unexpected error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListUsers(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None):
        user = UserProfile.objects.get(email=request.user.email)

        if not check_permission(user, "users", "UserProfile", "view"):
            raise PermissionDenied(perm_required_error)

        try:
            if id:
                return Response(user_action.fetch(id), status=status.HTTP_200_OK)

            return Response(
                user_action.fetch_all(),
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error("Failed to fetch user(s): %s", str(e))
            return Response(
                {"msg": "Unexpected error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EditUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        user = UserProfile.objects.get(email=request.user.email)

        if not check_permission(user, "users", "UserProfile", "edit"):
            raise PermissionDenied(perm_required_error)

        try:
            return Response(
                user_action.update(id, request.data),
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error("Failed with an error %s", str(e))
            return Response(
                {"detail": "Internal server error"},
                status=status.HTTP_404_NOT_FOUND
            )


class DeleteUser(APIView):
    def delete(self, request, id):
        user = UserProfile.objects.get(email=request.user.email)

        if not check_permission(user, "users", "UserProfile", "delete"):
            raise PermissionDenied(perm_required_error)

        try:
            result = user_action.delete(id)
            return Response(result, status=status.HTTP_200_OK)
        except NotFound as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception:
            return Response(
                {"detail": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
