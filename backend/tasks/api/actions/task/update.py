from tasks.api.actions.base import APIAction
from tasks.api.serializers import TaskSerializer
from tasks.models import Task


class UpdateTaskAPIAction(APIAction):
    def execute(self, *args, **kwargs) -> Task:
        try:
            data : Task = args[0]
            task_id : int = args[1]
            task : Task = Task.objects.get(id = task_id)
            serializer: TaskSerializer = TaskSerializer(task, data=data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            else:
                raise
        except FileNotFoundError:
            raise
