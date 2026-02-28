from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from optio.search.api.actions.search_action import SearchAPIAction

SEARCH_TYPES = ['fuzzy', 'prefix', 'exact', 'substring']


class SearchTaskAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        action = SearchAPIAction()
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


class SearchProjectAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        action = SearchAPIAction()
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


class SearchUserAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        action = SearchAPIAction()
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
