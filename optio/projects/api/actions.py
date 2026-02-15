from django.shortcuts import get_object_or_404

from optio.projects.serializers import ProjectSerializer
from optio.users.serializers import UserSerializer
from optio.users.models import UserProfile
from optio.projects.models import Project


class ProjectUserAPIAction:

    def get_project_users(self, project_id):
        queryset = UserProfile.objects.filter(userproject__project_id=project_id)
        users = UserSerializer(queryset, many=True).data
        return users


class ProjectAPIAction:

    def get_projet(self, project_id):
        project = get_object_or_404(Project, id=project_id)
        return ProjectSerializer(project).data

    def update_project(self, data, project_id):
        project = get_object_or_404(Project, id=project_id)
        serializer = ProjectSerializer(project, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return serializer.data
        return {"Message": "Project update failed!!!"}

