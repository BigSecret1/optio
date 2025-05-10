from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from optio.projects.models import Project, UserProject
from optio.users.models import UserProfile
from optio.projects.serializers import ProjectSerializer
from optio.utils.user import is_admin
from optio.projects.actions.base import (
    get_projects_for_admin,
    get_projects_for_normal_user
)
from optio.projects.actions.assign_project import (
    assign_project,
    assign_project_to_normal_user,
    assign_project_to_admin
)

import logging


class ProjectListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        projects = []
        if is_admin(request.user):
            projects = get_projects_for_admin()
        else:
            projects = get_projects_for_normal_user(request.user)

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save()
            return Response(
                {'id': project.id, 'name': project.name},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response(
                {'error': 'Project not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateProjectAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = ProjectSerializer(data=request.data)
            if serializer.is_valid():
                project = serializer.save()
                if is_admin(request.user):
                    assign_project_to_admin(project)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.error("Error creating project: %s", str(e))
            return Response(
                {"error": "Internal server error while creating project"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AssignProjectAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, user_id, project_id):
        if not user_id or not project_id:
            return Response(
                {"error": "user_id and project_id are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = UserProfile.objects.get(id=user_id)
            project = Project.objects.get(id=project_id)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if UserProject.objects.filter(user=user, project=project).exists():
            return Response(
                {"message": "User is already assigned to this project."},
                status=status.HTTP_200_OK
            )

        assign_project(user, project)
        return Response(
            {"message": "User successfully added to project."},
            status=status.HTTP_200_OK
        )
