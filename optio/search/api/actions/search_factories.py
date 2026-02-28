from optio.search.api.actions.search_strategies import (
    FuzzySearchStrategy,
    PrefixSearchStrategy,
    SubstringSearchStrategy,
    ExactSearchStrategy
)

from optio.search.api.actions.search_entities import (
    TaskEntityFinder,
    ProjectEntityFinder,
    UserEntityFinder,
)


class SearchStrategyFactory:

    @staticmethod
    def get_strategy(search_type: str):
        search_type = search_type.lower()

        if search_type == "fuzzy":
            return FuzzySearchStrategy()
        elif search_type == "prefix":
            return PrefixSearchStrategy()
        elif search_type == "substring":
            return SubstringSearchStrategy()
        elif search_type == "exact":
            return ExactSearchStrategy()
        else:
            raise ValueError("Invalid search type")


class EntityFinderFactory:

    @staticmethod
    def get_entity(entity_type: str):
        entity_type = entity_type.lower()

        if entity_type == "task":
            return TaskEntityFinder()
        elif entity_type == "project":
            return ProjectEntityFinder()
        elif entity_type == "user":
            return UserEntityFinder()
        else:
            raise ValueError("Invalid entity type")
