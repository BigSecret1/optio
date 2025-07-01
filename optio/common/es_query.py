from abc import ABC, abstractmethod


class ESQuery(ABC):
    """
    This interface is intended to be implemented by subclass which is serving
    suggestion based on user inputs.
    ES is reference for elastric search and method names are copy of ES queries
    for better functionality understanding.
    """

    @abstractmethod
    def exact_match(self):
        pass

    @abstractmethod
    def prefix_match(self):
        pass

    @abstractmethod
    def substring_match(self):
        pass

    @abstractmethod
    def fuzzy_match(self):
        pass
