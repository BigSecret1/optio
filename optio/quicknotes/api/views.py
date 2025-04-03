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
            return Response(
                quick_note_api_action.add_quicknote(request.data),
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            logging.error("Recevied an exception due to invalid payload %s", str(e))
            return Response(
                {"error": "Invalid payload"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logging.error("Error while adding note %s", str(e))
            return Response(
                {"error": "Internal Server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListNoteAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, note_id: int) -> Response:
        try:
            return Response(
                quick_note_api_action.fetch_note(note_id),
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UpdateNoteAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request: Request, note_id: int):
        try:
            return Response(
                quick_note_api_action.update_quicknote(note_id, request.data),
                status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(
                {"error": "Validation error"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
