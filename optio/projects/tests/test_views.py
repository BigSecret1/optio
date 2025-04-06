from rest_framework import status
from rest_framework.exceptions import ValidationError

from unittest.mock import patch

from django.urls import reverse

from optio.projects.models import Project
from optio.tests.base_test import BaseAPITestCase


class TestProjectListView(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        self.fetch_url = reverse("project-list")

    def test_get_project_list_success(self):
        self.authenticate()

        Project.objects.create(name="Project Alpha")
        Project.objects.create(name="Project Beta")

        response = self.client.get(self.fetch_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "Project Alpha")

    def test_get_requires_authentication(self):
        response = self.client.post(self.fetch_url, data={"name": "Some Project"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TestCreateProject(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.create_url = reverse("create-project")

    def test_create_project_success(self):
        self.authenticate()

        payload = {
            "name": "New Project",
            "description": "Project description"
        }

        response = self.client.post(
            self.create_url,
            data=payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], payload["name"])
        self.assertTrue(Project.objects.filter(name="New Project").exists())

    def test_invalid_data(self):
        self.authenticate()

        payload = {
            "description": "No name provided"
        }

        response = self.client.post(
            self.create_url,
            data=payload, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_unauthenticated_access(self):
        payload = {
            "name": "Unauthorized Project",
            "description": "No token",
            "last_updated": "2025-04-03T12:00:00Z"
        }

        response = self.client.post(self.create_url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
