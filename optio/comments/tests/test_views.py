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


class TestListView(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        self.fetch_url = reverse("add-comment")

        self.task_id = 1
        self.comment_data = [
            {
                "comment": "This is the first comment.",
                "task_id": 101,
                "created_at": "2024-03-29T12:00:00Z"
            },
            {
                "comment": "This is another comment related to the task.",
                "task_id": 101,
                "created_at": "2024-03-29T12:05:00Z"
            }
        ]

        self.fetch_url = reverse("list-comments", args=[self.task_id])

    @patch("optio.comments.api.views.check_permission")
    @patch("optio.comments.api.views.comment_api_action.fetch_all_comments")
    def test_fetch_comments_success(
        self,
        mock_fetch_all_comments,
        mock_check_permission
    ):
        self.authenticate()

        print("Request on url ", self.fetch_url)
        mock_fetch_all_comments.return_value = self.comment_data
        mock_check_permission.return_value = True

        response = self.client.get(self.fetch_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), self.comment_data)

    @patch("optio.comments.api.views.check_permission")
    def test_get_comments_permission_denied(self, mock_check_permission):
        mock_check_permission.return_value = False

        response = self.client.get(self.fetch_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("optio.comments.api.views.check_permission")
    @patch("optio.comments.api.views.comment_api_action.fetch_all_comments")
    def test_get_comments_internal_server_error(self, mock_fetch_all_comments,
                                                mock_check_permission):
        self.authenticate()

        mock_fetch_all_comments.side_effect = Exception("Some error")
        mock_check_permission.return_value = True

        response = self.client.get(self.fetch_url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.json(), {"error": "Internal server error"})
