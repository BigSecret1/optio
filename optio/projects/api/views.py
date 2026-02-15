from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from optio.projects.actions.assign_project import assign_project_to_users
from optio.projects.api.actions import ProjectUserAPIAction, ProjectAPIAction


class ProjectUsersAPIView(APIView):

    def get(self, request: Request, project_id):
        project_user_api_action = ProjectUserAPIAction()
        users = project_user_api_action.get_project_users(project_id)
        return Response(users)

    def post(self, request: Request, project_id):
        user_ids = request.data.get("user_ids")
        result = assign_project_to_users(project_id, user_ids)
        return Response({"data": result})


class ProjectAPIView(APIView):

    def get(self, request: Request, project_id=None):
        project_action = ProjectAPIAction()
        return Response(project_action.get_projet(project_id))

    def patch(self, request: Request, project_id):
        project_action = ProjectAPIAction()
        return Response(project_action.update_project(request.data, project_id))
