from .base import APIAction
from tasks.models import Task


class TaskActionManager:
    def __init__(self, strategy: APIAction):
        self.strategy = strategy

    def set_strategy(self, strategy: APIAction):
        self.strategy = strategy

    def create(self, data : Task):
        return self.strategy.create(data)

    def fetch(self, task_id : int):
        return self.strategy.fetch(task_id)

    def fetch_all(self, project_id : int = None, parent_task_id : int = None):
        return self.strategy.fetch_all(project_id)

    def update(self, task_id : int, data : Task):
        return self.strategy.update(task_id, data)

    def delete(self, task_id : int):
        return self.strategy.delete(task_id)
