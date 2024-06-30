from django.shortcuts import render


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from .models import CustomUser, Profile
from .serializers import UserSerializer, ProfileSerializer
import json

class RegisterView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = CustomUser.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        return Response(ProfileSerializer(profile).data)

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        data = json.loads(request.body)
        profile.bio = data.get('bio', profile.bio)
        profile.location = data.get('location', profile.location)
        profile.birth_date = data.get('birth_date', profile.birth_date)
        profile.save()
        return Response(ProfileSerializer(profile).data)

