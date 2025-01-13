from abc import ABC
from optio.tasks.models import Task


class APIAction(ABC):
    def create(self, data):
        pass

    def fetch(self, task_id: int):
        pass

    def fetch_all(self, project_id: int = None, parent_task_id: int = None):
        pass

    def update(self, task_id: int, data: Task):
        pass

    def delete(self, task_id: int):
        pass
