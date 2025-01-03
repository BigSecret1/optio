from rest_framework.exceptions import ValidationError
from rest_framework import serializers

from django.db import transaction

import logging

from tasks.api.actions.base import APIAction
from tasks.api.serializers import TaskSerializer
from tasks.models import Task


class CreateTaskAPIAction(APIAction):
    def execute(self, *args, **kwargs) -> Task:
        try:
            with transaction.atomic():
                task_data : Task = args[0]
                serializer = TaskSerializer(data=task_data)
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
