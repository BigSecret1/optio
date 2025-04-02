from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.exceptions import ValidationError

from unittest.mock import patch

from django.urls import reverse

from optio.users.models import UserProfile


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = UserProfile.objects.create_user(
            email="optiotestemail@example.com",
            password="optio@123"
        )

        refresh: RefreshToken = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

        self.valid_payload = {"id": 1, "note": "some quick note."}
        self.invalid_payload = {}

    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")


class TestAddNote(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        self.create_url = reverse("add-quicknote")

    @patch("optio.quicknotes.api.views.quick_note_api_action.add_quicknote")
    def test_add_note_success(self, mock_add_quicknote):
        self.authenticate()

        mock_add_quicknote.return_value = {"message": "Note added successfully"}

        response = self.client.post(self.create_url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Note added successfully"})

    @patch("optio.quicknotes.api.views.quick_note_api_action.add_quicknote")
    def test_validation_error(self, mock_add_quicknote):
        self.authenticate()

        mock_add_quicknote.side_effect = ValidationError("Invalid data")
        response = self.client.post(
            self.create_url,
            self.invalid_payload,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Invalid payload"})

    @patch("optio.quicknotes.api.views.quick_note_api_action.add_quicknote")
    def test_server_error(self, mock_add_quicknote):
        self.authenticate()

        mock_add_quicknote.side_effect = Exception("Unexpected error")

        response = self.client.post(self.create_url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data, {"error": "Internal Server error"})

    def test_add_note_unauthenticated(self):
        response = self.client.post(self.create_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
