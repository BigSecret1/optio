from abc import ABC, abstractmethod


class EntityFinder(ABC):

    @abstractmethod
    def get_index(self) -> str:
        pass

    @abstractmethod
    def get_search_field(self) -> str:
        pass


class TaskEntityFinder(EntityFinder):

    def get_index(self) -> str:
        return "tasks_index"

    def get_search_field(self) -> str:
        return "title"


class ProjectEntityFinder(EntityFinder):

    def get_index(self) -> str:
        return "projects_index"

    def get_search_field(self) -> str:
        return "name"


class UserEntityFinder(EntityFinder):

    def get_index(self) -> str:
        return "users_index"

    def get_search_field(self) -> str:
        return "first_name"
