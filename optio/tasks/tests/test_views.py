from http.client import responses

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.contrib.auth.models import Group

from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError

from unittest.mock import patch

from optio.tasks.models import Task
from optio.users.models import UserProfile, UserGroup

User = get_user_model()


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
        """Authenticate the test client through token geenrated for user"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")


class TestCreateTaskView(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.create_task_url = reverse("create-task")

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_create")
    def test_create_task_success(self, mock_perform_create, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_create.return_value = {"message": "Task created successfully"}

        response = self.client.post(
            self.create_task_url,
            {"title": "New Task"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"message": "Task created successfully"})
        mock_perform_create.assert_called_once()

    def test_unauthenticate_reqest(self):
        response = self.client.post(
            self.create_task_url,
            {"title": "New Task"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("optio.tasks.api.views.tasks.check_permission")
    def test_permission_denined(self, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = False

        response = self.client.post(
            self.create_task_url,
            {"title": "New Task"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_create")
    def test_validation_error(self, mock_perform_create, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_create.side_effect = ValidationError("Invalid data")

        response = self.client.post(
            self.create_task_url,
            {"invalidRequest": "xyz"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.json())
        self.assertEqual(response.json()["error"], "Invalid request body")

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_create")
    def test_internal_server_error(self, mock_perform_create, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_create.side_effect = Exception("Unexpected error")

        response = self.client.post(
            self.create_task_url,
            {"title": "New Task"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.json())
        self.assertEqual(response.json()["error"], "wrong request body")

    def tearDown(self):
        self.client.logout()


class TestGetTasksView(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        
        self.get_task_url = reverse("get-tasks")

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_fetch_all")
    def test_get_tasks_success(self, mock_perform_fetch_all, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_fetch_all.return_value = [{"task": "Task 1"}, {"task": "Task 2"}]

        response = self.client.get(
            self.get_task_url,
            {"project_id": "123"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
