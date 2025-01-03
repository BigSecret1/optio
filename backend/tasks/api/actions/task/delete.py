from tasks.api.actions.base import APIAction
from typing import Optional
from rest_framework.exceptions import NotFound
from tasks.models import Task

from django.core.exceptions import ObjectDoesNotExist

class DeleteTaskAPIAction(APIAction):
    def execute(self, *args, **kwargs):
        try:
            task_id: int = args[0]
            task: Task = Task.objects.get(id=task_id)
            task.delete()
        except Task.DoesNotExist:
            raise NotFound(detail=f"Task with ID {task_id} does not exist.")
        except Exception as e:
            raise
