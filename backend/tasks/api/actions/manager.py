from .base import APIAction
from tasks.models import Task


class TaskActionManager:
    """
    This class a context class which is responsible for performing varios operations
    based on the strategy it is passed or set.
    """
    def __init__(self, strategy: APIAction):
        self.strategy = strategy

    def set_strategy(self, strategy: APIAction):
        self.strategy = strategy

    def perform_create(self, data : Task):
        return self.strategy.create(data)

    def perform_fetch(self, task_id : int):
        return self.strategy.fetch(task_id)

    def perform_fetch_all(self, project_id : int = None, parent_task_id : int = None):
        return self.strategy.fetch_all(project_id)

    def perform_update(self, task_id : int, data : Task):
        return self.strategy.update(task_id, data)

    def perform_delete(self, task_id : int):
        return self.strategy.delete(task_id)

