from abc import ABC, abstractmethod


class APIAction(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def execute(self, *args, **kwargs):
        pass

