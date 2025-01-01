from rest_framework.exceptions import ValidationError
from django.db import transaction

import logging
from typing import Any, Dict, Optional

from tasks.models import Task
from tasks.api.actions.base import APIAction
from tasks.serializers import SubTaskSerializer


class CreateTaskAPIAction(APIAction):
    def execute(self, data) -> Optional[Task]:
        try:
            with transaction.atomic():
                serializer = SubTaskSerializer(data=data)
                if serializer.is_valid():
                    task_data: Optional[Dict[str, Any]] = serializer.validated_data
                    task = Task.objects.create(
                        title=task_data.get('title', ''),
                        due_date=task_data.get('due_date', None),
                        comments=task_data.get('comments', ''),
                        description=task_data.get('description', ''),
                        task_status=task_data.get('task_status', 'To Do'),
                        project_id=task_data.get('project_id', 2),
                        parent_task=task_data.get('parent_task', None),
                    )

                    return serializer.data
                else:
                    raise serializers.ValidationError(serializer.errors)
        except ValidationError as e:
            logging.error("Validation error while creating task: %s", str(e))
            raise
        except Exception as e:
            logging.error("%s while creating task", str(e))
            raise
