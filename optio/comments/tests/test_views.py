from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError

from unittest.mock import patch

from django.urls import reverse

from optio.users.models import UserProfile
from optio.utils.exceptions import perm_required_error


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = UserProfile.objects.create_user(
            email="optiotestemail@example.com",
            password="optio@123"
        )

        refresh: RefreshToken = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")


class TestCreateView(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        self.create_url = reverse("add-comment")

    @patch('optio.comments.api.views.check_permission')
    @patch('optio.comments.api.views.comment_api_action.add_comment')
    def test_create_task_success(self, mock_add_comment, mock_check_permission):
        mock_check_permission.return_value = True
        mock_add_comment.return_value = {"message": "Comment was added successfully"}

        self.authenticate()

        response = self.client.post(
            self.create_url,
            {"comment": "This is a test comment"},
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Comment was added successfully"})

    @patch('optio.comments.api.views.check_permission')
    @patch('optio.comments.api.views.comment_api_action.add_comment')
    def test_permission_denied(self, mock_add_comment,
                               mock_check_permission):
        mock_check_permission.return_value = False

        self.authenticate()

        response = self.client.post(
            self.create_url,
            {"comment": "This is a test comment"},
            format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(str(response.data['detail']), perm_required_error)

    @patch('optio.comments.api.views.check_permission')
    @patch('optio.comments.api.views.comment_api_action.add_comment')
    def test_validation_error(self, mock_add_comment, mock_check_permission):
        mock_check_permission.return_value = True
        mock_add_comment.side_effect = ValidationError("Invalid data")

        self.authenticate()

        response = self.client.post(self.create_url, {"comment": ""}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Invalid request body"})

    @patch('optio.comments.api.views.check_permission')
    @patch('optio.comments.api.views.comment_api_action.add_comment')
    def test_create_comment_server_error(self, mock_add_comment, mock_check_permission):
        mock_check_permission.return_value = True
        mock_add_comment.side_effect = Exception("Some server error")

        self.authenticate()

        response = self.client.post(
            self.create_url,
            {"comment": "This is atestcomment"},
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data, {"error": "Internal server error"})

    def tearDown(self):
        self.client.logout()

