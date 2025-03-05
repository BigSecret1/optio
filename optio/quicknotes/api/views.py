import logging

from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from optio.quicknotes.api.actions.quicknote import QuickNoteAPIAction

quick_note_api_action = QuickNoteAPIAction()


class AddNoteAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        try:
            return Response(quick_note_api_action.add_quicknote(request.data),
                            status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.error("Error while adding note %s", e)
            return Response({"error": "Server error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListNoteAPIView(APIView):
    pass


class UpdateNoteAPIView(APIView):
    pass
