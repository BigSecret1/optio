from django.contrib.auth.models import User, Group
from django.urls import reverse

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import status

from unittest.mock import patch

from optio.users.models import UserProfile, UserGroup


class TestRegisterView(APITestCase):
    def setUp(self):
        self.admin_user = UserProfile.objects.create_user(
            email="admin@example.com",
            password="adminpass"
        )

        # get_or_create returns tuple, unpacking is needed by using `_`
        self.admin_group, _ = Group.objects.get_or_create(name="Admin")
        UserGroup.objects.create(user=self.admin_user, group=self.admin_group)
        self.admin_user.is_superuser = True
        self.admin_user.save()

        refresh: RefreshToken = RefreshToken.for_user(self.admin_user)
        self.token = str(refresh.access_token)

        self.register_url = reverse("register")

    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    @patch("optio.users.views.UserGroup.objects.create")
    @patch("optio.users.views.Group.objects.get")
    @patch("optio.users.views.UserProfile.objects.create_user")
    def test_successful_user_registration(
        self,
        mock_create_user,
        mock_group_get,
        mock_usergroup_create
    ):
        self.authenticate()

        user = UserProfile(
            email="newuser@example.com",
            first_name="New",
            last_name="User"
        )
        mock_create_user.return_value = user

        group = Group(name="Gamma")
        mock_group_get.return_value = group

        payload = {
            "email": "newuser@example.com",
            "password": "securepassword",
            "first_name": "New",
            "last_name": "User",
            "role": "Gamma"
        }

        response = self.client.post(
            self.register_url,
            data=payload,
            format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_create_user.assert_called_once()
        mock_group_get.assert_called_once_with(name="Gamma")
        mock_usergroup_create.assert_called_once()

    def test_permission_denied_for_non_admin(self):
        non_admin = UserProfile.objects.create_user(
            email="nonadmin@example.com",
            password="pass123"
        )
        refresh: RefreshToken = RefreshToken.for_user(non_admin)
        non_admin_token = str(refresh.access_token)
        non_admin_header = {"HTTP_AUTHORIZATION": f"Bearer {non_admin_token}"}

        payload = {
            "email": "unauthorized@example.com",
            "password": "pass123",
            "role": "Gamma"
        }

        response = self.client.post(
            self.register_url,
            data=payload,
            format="json",
            **non_admin_header
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["error"],
            "Permission denied, only Admin or Superuser can create new users"
        )

    def test_missing_email_or_password(self):
        self.authenticate()

        response = self.client.post(
            self.register_url,
            data={"email": "", "password": "", "role": "Gamma"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Email and password are required")

    def test_invalid_role(self):
        self.authenticate()

        payload = {
            "email": "test@example.com",
            "password": "pass123",
            "role": "InvalidRole"
        }
        response = self.client.post(
            self.register_url,
            data=payload,
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "User role doesn't exist")
