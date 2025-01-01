from rest_framework.exceptions import ValidationError
from django.db import transaction

import logging
from typing import Any, Dict, Optional

from tasks.models import Task
from tasks.api.actions.base import APIAction
from tasks.api.serializers import SubTaskSerializer


class CreateTaskAPIAction(APIAction):
    def execute(self, data) -> Optional[Task]:
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
