from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from optio.tasks.models import Task
from optio.tasks.api.serializers import TaskSerializer


class TaskAPIAction:

    def __init__(self, organization):
        self.organization = organization

    def _get_task(self, task_id):
        return get_object_or_404(
            Task,
            pk=task_id,
            organization=self.organization
        )

    def list_tasks(self, project_id):
        return TaskSerializer(
            Task.objects.filter(
                organization=self.organization,
                project_id=project_id,
                parent_task__isnull=True
            ).order_by("-created_at"),
            many=True
        ).data

    def list_subtasks(self, task_id):
        parent = self._get_task(task_id)

        return TaskSerializer(
            parent.sub_tasks.all().order_by("-created_at"),
            many=True
        ).data

    def get_task(self, task_id):
        task = self._get_task(task_id)
        return TaskSerializer(task).data

    def create_task(self, data):
        serializer = TaskSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        serializer.save(organization=self.organization)

        return serializer.data

    def update_task(self, task_id, data):
        task = self._get_task(task_id)

        serializer = TaskSerializer(task, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return serializer.data

    def delete_task(self, task_id):
        task = self._get_task(task_id)
        task.delete()
        return {"message": "Task deleted successfully"}
