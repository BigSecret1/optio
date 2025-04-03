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

    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")


class TestSearchTaskAPIView(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.search_url = reverse("search-task")

    @patch("optio.search.api.views.task_es_query.execute")
    def test_search_task_success(self, mock_execute):
        self.authenticate()

        task_data = [
            {
                "id": "168",
                "title": "task title"
            },
            {
                "id": "93",
                "title": "change th title"
            }
        ]

        mock_execute.return_value = task_data

        response = self.client.post(self.search_url, data={"test": "test title"},
                                    format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), task_data)

    def test_unauthenticated(self):
        response = self.client.post(self.search_url, data={"query": "test"},
                                    format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("optio.search.api.views.task_es_query.execute")
    def test_search_task_internal_error(self, mock_execute):
        self.authenticate()

        mock_execute.side_effect = Exception("Elasticsearch connection error")

        response = self.client.post(
            self.search_url, data={"title": "test title"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.json(), {"msg": "Internal server error"})
