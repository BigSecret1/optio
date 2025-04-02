from django.urls import reverse

from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError, NotFound

from unittest.mock import patch

from optio.tasks.models import Task
from optio.projects.models import Project
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

        self.get_tasks_url = reverse("get-tasks")

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_fetch_all")
    def test_get_tasks_success(self, mock_perform_fetch_all, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_fetch_all.return_value = [{"title": "Task 1"}, {"title": "Task 2"}]

        response = self.client.get(
            self.get_tasks_url,
            {"project_id": "123"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), [{"title": "Task 1"}, {"title": "Task 2"}])
        mock_perform_fetch_all.assert_called_once_with("123")

    def test_unauthenticate_reqest(self):
        response = self.client.post(
            self.get_tasks_url,
            {"title": "New Task"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("optio.tasks.api.views.tasks.check_permission")
    def test_permission_denied(self, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = False

        response = self.client.get(
            self.get_tasks_url,
            {"project_id": "123"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_fetch_all")
    def test_internal_server_error(self, mock_perform_fetch_all, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_fetch_all.side_effect = Exception("Unexpected error")

        response = self.client.get(
            self.get_tasks_url,
            {"project_id": "123"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def tearDown(self):
        self.client.logout()


class TestGetTaskById(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        self.task_id = 1
        self.task_data = {"id": self.task_id, "title": "Test Task", "status": "Pending"}

        self.get_task_url = reverse("get-task-by-id", args=[self.task_id])

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_fetch")
    def test_get_task_success(self, mock_perform_fetch, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_fetch.return_value = self.task_data

        response = self.client.get(self.get_task_url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), self.task_data)
        mock_perform_fetch.assert_called_once_with(self.task_id)

    def test_unauthenticated_request(self):
        response = self.client.get(self.get_task_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("optio.tasks.api.views.tasks.check_permission")
    def test_permission_denied(self, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = False

        response = self.client.get(self.get_task_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_fetch")
    def test_task_not_found(self, mock_perform_fetch, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_fetch.side_effect = Exception("Task not found")

        response = self.client.get(self.get_task_url, format="json")

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.json(), {"error": "Internal server error"})

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_fetch")
    def test_internal_server_error(self, mock_perform_fetch, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_fetch.side_effect = Exception("Unexpected error")

        response = self.client.get(self.get_task_url, format="json")

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.json(), {"error": "Internal server error"})

    def tearDown(self):
        self.client.logout()


class TestUpdateTaskView(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        project = Project.objects.create(name="Sample Project")
        self.task = Task.objects.create(
            title="Old Task",
            status="To Do",
            project=project
        )
        self.update_task_url = reverse("update-task", args=[self.task.id])

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_update")
    def test_update_task_success(self, mock_perform_update, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_update.return_value = {"id": self.task.id, "title": "Updated Task"}

        response = self.client.put(
            self.update_task_url,
            {"title": "Updated Task"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["title"], "Updated Task")
        mock_check_permission.assert_called_once_with(
            self.user,
            "tasks",
            "Task",
            "change"
        )
        mock_perform_update.assert_called_once_with(
            self.task.id,
            {"title": "Updated Task"}
        )

    def test_unauthenticated_request(self):
        response = self.client.put(self.update_task_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("optio.tasks.api.views.tasks.check_permission")
    def test_update_task_permission_denied(self, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = False

        response = self.client.put(
            self.update_task_url,
            {"title": "Updated Task"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json()["detail"], perm_required_error)
        mock_check_permission.assert_called_once_with(
            self.user,
            "tasks",
            "Task",
            "change"
        )

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_update")
    def test_update_task_not_found(self, mock_perform_update, mock_check_permission):
        self.authenticate()

        mock_perform_update.side_effect = NotFound()
        mock_check_permission.return_value = True

        response = self.client.put(reverse(
            "update-task", args=[999]),
            {"title": "Updated Task"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json(), {"error": "Task not found"})
        mock_perform_update.assert_called_once_with(999, {"title": "Updated Task"})


class TestDeleteTaskView(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        project = Project.objects.create(name="Sample Project")
        self.task = Task.objects.create(
            title="Sample Task",
            status="To Do",
            project=project
        )

        self.url = reverse("delete-task", args=[self.task.id])

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_delete")
    def test_delete_task_success(self, mock_perform_delete, mock_check_permission):
        self.authenticate()

        response = self.client.delete(self.url)

        mock_check_permission.return_value = True

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Deleted task successfully!!!"})
        mock_perform_delete.assert_called_once_with(self.task.id)
        mock_check_permission.assert_called_once_with(
            self.user,
            "tasks",
            "Task",
            "delete"
        )

    @patch("optio.tasks.api.views.tasks.check_permission")
    def test_delete_task_permission_denied(self, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = False

        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        mock_check_permission.assert_called_once_with(
            self.user,
            "tasks",
            "Task",
            "delete"
        )

    def test_delete_task_unauthenticated(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_delete")
    def test_delete_task_server_error(self, mock_perform_delete, mock_check_permission):
        self.client.force_authenticate(user=self.user)

        mock_check_permission.return_value = True
        mock_perform_delete.side_effect = Exception("Unexpected error")

        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data, {"error": "Failed to delete the task"})
        mock_perform_delete.assert_called_once_with(self.task.id)
        mock_check_permission.assert_called_once_with(
            self.user,
            "tasks",
            "Task",
            "delete"
        )

    @patch("optio.tasks.api.views.tasks.check_permission")
    @patch("optio.tasks.api.views.tasks.task_action_manager.perform_delete")
    def test_delete_task_not_found(self, mock_perform_delete, mock_check_permission):
        self.authenticate()

        mock_perform_delete.side_effect = NotFound()
        mock_check_permission.return_value = True

        non_existing_url = reverse("delete-task", args=[9999])

        response = self.client.delete(non_existing_url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Task with id 9999 doesn't exist"})
        mock_perform_delete.assert_called_once_with(9999)
        mock_check_permission.assert_called_once_with(
            self.user,
            "tasks",
            "Task",
            "delete"
        )


class TestCreateSubTaskView(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        self.project = Project.objects.create(name="Test Project")
        self.task = Task.objects.create(
            title="Parent Task",
            status="To Do",
            project=self.project
        )
        self.create_url = reverse("create-subtask")
        self.data = {
            "title": "Subtask",
            "status": "In Progress",
            "parent_task": self.task.id
        }

    @patch("optio.tasks.api.views.subtasks.check_permission")
    @patch('optio.tasks.api.actions.TaskActionManager.perform_create')
    def test_create_subtask_success(self, mock_perform_create, mock_check_permission):
        self.authenticate()

        mock_check_permission.return_value = True
        mock_perform_create.return_value = self.data

        response = self.client.post(self.create_url, self.data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.data)

    @patch("optio.tasks.api.views.subtasks.check_permission")
    def test_create_subtask_permission_denied(self, mock_check_permission):
        mock_check_permission.return_value = False

        self.authenticate()
        response = self.client.post(self.create_url, self.data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], perm_required_error)

    @patch("optio.tasks.api.views.subtasks.check_permission")
    @patch('optio.tasks.api.actions.TaskActionManager.perform_create')
    def test_create_subtask_validation_error(
        self,
        mock_perform_create,
        mock_check_permission
    ):
        mock_check_permission.return_value = True
        mock_perform_create.side_effect = ValidationError("Invalid data")

        self.authenticate()
        response = self.client.post(self.create_url, self.data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.json())
        self.assertEqual(response.json()["error"], "Invalid request body")

    @patch("optio.tasks.api.views.subtasks.check_permission")
    @patch('optio.tasks.api.actions.TaskActionManager.perform_create')
    def test_create_subtask_internal_server_error(
        self, mock_perform_create,
        mock_check_permission
    ):
        mock_check_permission.return_value = True
        mock_perform_create.side_effect = Exception("Server error")

        self.authenticate()
        response = self.client.post(self.create_url, self.data, format='json')

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data['error'], "Internal Server error")


class TestGetSubTasks(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        self.parent_task_id = 1
        self.url = reverse("get-subtasks", args=[self.parent_task_id])

    @patch("optio.tasks.api.views.subtasks.check_permission")
    @patch('optio.tasks.api.actions.TaskActionManager.perform_fetch_all')
    def test_get_subtasks_success(self, mock_perform_fetch_all, mock_check_permission):
        mock_check_permission.return_value = True
        mock_perform_fetch_all.return_value = [{"id": 1, "name": "Subtask 1"}]

        self.authenticate()
        response = self.client.get(self.url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [{"id": 1, "name": "Subtask 1"}])

    @patch("optio.tasks.api.views.subtasks.check_permission")
    def test_get_subtasks_permission_denied(self, mock_check_permission):
        mock_check_permission.return_value = False

        self.authenticate()
        response = self.client.get(self.url, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], perm_required_error)

    @patch("optio.tasks.api.views.subtasks.check_permission")
    @patch('optio.tasks.api.actions.TaskActionManager.perform_fetch_all')
    def test_get_subtasks_internal_server_error(
        self, mock_perform_fetch_all,
        mock_check_permission
    ):
        mock_check_permission.return_value = True
        mock_perform_fetch_all.side_effect = Exception("Server error")

        self.authenticate()
        response = self.client.get(self.url, format='json')

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data['error'], "Internal Server error")
