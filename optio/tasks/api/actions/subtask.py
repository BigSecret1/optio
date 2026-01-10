from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from django.db import transaction

import logging
from typing import Any, Dict, Optional, List

from optio.tasks.models import Task
from optio.tasks.api.serializers import SubTaskSerializer
from optio.tasks.api.actions.base import APIAction


class SubTaskAPIAction(APIAction):
    def create(self, data):
        try:
            with transaction.atomic():
                serializer = SubTaskSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return serializer.data
                else:
                    raise serializers.ValidationError(serializer.errors)
        except ValidationError as e:
            logging.error("Validation error while creating task: %s", str(e))
            raise
        except Exception as e:
            logging.error("%s while creating task", str(e))
            raise

    def fetch_all(self, parent_task_id: int):
        try:
            sub_tasks = Task.objects.filter(parent_task_id=parent_task_id)
            serializer = SubTaskSerializer(instance=sub_tasks, many=True)
            return serializer.data
        except Exception as e:
            logging.error("%s occured while fetching subtask of task with id %s", e,
                          parent_task_id)
            return None
