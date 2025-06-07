from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.models import Group

from optio.users.models import UserProfile, UserGroup
from django.core.management import call_command


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = UserProfile.objects.create_user(
            email="optiotestemail@example.com",
            password="optio@123"
        )

        self.group = Group.objects.get(name="Admin")
        UserGroup.objects.create(user=self.user, group=self.group)

        refresh: RefreshToken = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        call_command('setup_groups')
