from tasks.api.actions.base import APIAction
from tasks.api.serializers import TaskSerializer
from tasks.models import Task

from typing import Optional, List, Any
import logging


class FetchTasksAPIAction(APIAction):
    def execute(self, *args, **kwargs) -> Task:
        try:
            project_id : int = args[0]
            tasks : Optional[Task]

            if project_id is not None:
                tasks = Task.objects.filter(project = project_id)
            else:
                tasks = Task.objects.all()

            serializer = TaskSerializer(instance = tasks, many = True)
            return serializer.data
        except Exception as e:
            logging.error("%s exception occured while fetching all tasks", str(e))
            raise
