from tasks.api.actions.base import APIAction
from tasks.api.serializers import TaskSerializer
from tasks.models import Task

from typing import Optional, List, Any


class FetchTaskAPIAction(APIAction):
    def execute(self, *args, **kwargs) -> Task:
        try:
            task_id : int = args[0]
            task : Optional[Task] = Task.objects.filter(id = task_id)
            serializer : Task = TaskSerializer(instance = task, many = True)

            return serializer.data
        except Exception as e:
            raise
