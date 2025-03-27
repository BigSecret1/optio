import unittest
from unittest.mock import patch, MagicMock
from django.urls import reverse
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from rest_framework import status
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from django.contrib.auth.models import User

from optio.comments.api.views import CreateView
from optio.comments.api.actions import CommentAPIAction
from optio.permissions import check_permission

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


    @patch('optio.permissions.check_permission')
    @patch('optio.comments.api.actions.CommentAPIAction.add_comment')
    def test_create_comment_success(self, mock_add_comment, mock_check_permission):
        mock_check_permission.return_value = True
        mock_add_comment.return_value = {"message": "Comment was added successfully"}

        request = self.factory.post(self.url, {"comment": "This is a test comment"}, format='json')
        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Comment added successfully"})
