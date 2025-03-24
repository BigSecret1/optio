from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.contrib.auth.models import Group

import json

from optio.users.models import UserProfile, UserGroup
from optio.users.serializers import UserSerializer
from optio.utils.exceptions import perm_required_error
from optio.permissions import check_permission

ROLES = ["Admin", "Alpha", "Beta", "Gamma"]


class RegisterView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        print(user.groups.all())
        print(user.groups.filter(name=["Admin"]).exists())

        # If user doesn't belongs to Admin or Alpha group then it can't create new user
        if not (user.is_superuser and user.groups.filter(name=["Admin"]).exists()):
            return Response({"error": "Permission denied"}, status=403)

        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        role = data.get("role", "Gamma")

        if not email or not password:
            return Response({'error': 'Email and password are required'},
                            status=status.HTTP_400_BAD_REQUEST)

        if role not in ROLES:
            return Response({"error": "User role doesn't exist"},
                            status=status.HTTP_400_BAD_REQUEST)

        user = UserProfile.objects.create_user(email=email, password=password,
                                               first_name=first_name,
                                               last_name=last_name)
        group = Group.objects.get(name=role)
        UserGroup.objects.create(user=user, group=group)

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'},
                        status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"msg": "logged out successfully"},
                            status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"msg": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
