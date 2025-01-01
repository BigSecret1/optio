import logging
from typing import Any, Dict, Optional
from tasks.models import Task
from tasks.api.serializers import SubTaskSerializer
from tasks.api.actions.base import APIAction

class FetchTasksAPIActin(APIAction):
    def execute(self, parent_task_id : int):
        try:
            sub_tasks : Optional[List[Dict[str, Any]]] = Task.objects.filter(parent_task_id=parent_task_id)
            fields_to_send_in_response : List[str] = ["id", "title", "project", "task_status"]
            serializer = SubTaskSerializer(instance = sub_tasks, many = True, fields = fields_to_send_in_response)

            return serializer.data
        except Exception as e:
            logging.error("%s occured while fetching subtasks of task with id %s", e, parent_task_id)
            return None
