from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from optio.search.api.actions.search_action import SearchAPIAction
from optio.organizations.api.views import BaseOrganizationAPIView

SEARCH_TYPES = ['exact', 'prefix', 'substring', 'fuzzy']


class SearchTaskAPIView(BaseOrganizationAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, organization_id: int):
        action = SearchAPIAction(organization_id)
        search_keyword = request.data.get('title')
        entity_type = 'task'

        return Response(
            action.search(
                entity_type,
                search_keyword,
                SEARCH_TYPES
            ),
            status=status.HTTP_200_OK
        )


class SearchProjectAPIView(BaseOrganizationAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, organization_id: int):
        action = SearchAPIAction(organization_id)
        search_keyword = request.data.get('name')
        entity_type = 'project'

        return Response(
            action.search(
                entity_type,
                search_keyword,
                SEARCH_TYPES
            ),
            status=status.HTTP_200_OK
        )


class SearchUserAPIView(BaseOrganizationAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, organization_id: int):
        action = SearchAPIAction(organization_id)
        search_keyword = request.data.get('first_name')
        entity_type = 'user'

        return Response(
            action.search(
                entity_type,
                search_keyword,
                SEARCH_TYPES
            ),
            status=status.HTTP_200_OK
        )
