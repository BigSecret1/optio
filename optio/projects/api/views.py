from rest_framework.generics import ListAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from optio.projects.actions.assign_project import assign_project_to_users
from optio.projects.api.actions import ProjectUserAPIAction


class ProjectUsersAPIView(APIView):

    def get(self, request, project_id):
        project_user_api_action = ProjectUserAPIAction()
        users = project_user_api_action.get_project_users(project_id)
        return Response({"data": users})

    def post(self, request, project_id):
        user_ids = request.data.get("user_ids")
        result = assign_project_to_users(project_id, user_ids)
        return Response({"data": result})