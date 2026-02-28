import logging

from elasticsearch_dsl import Search
from optio.search.api.actions.search_factories import (
    SearchStrategyFactory,
    EntityFinderFactory
)
from optio.search.api.actions.search_entities import EntityFinder
from optio.search.api.actions.search_strategies import SearchStrategy

logger = logging.getLogger(__name__)


class SearchAPIAction:

    def __init__(self):
        self.search_results = []

    def search(self, entity_type: str, search_keyword: str, search_types=None):
        if search_types is None:
            search_types = []

        entity : EntityFinder = EntityFinderFactory.get_entity(entity_type)

        for search_type in search_types:
            strategy : SearchStrategy = SearchStrategyFactory.get_strategy(search_type)

            query = strategy.build_query(
                entity.get_search_field(),
                search_keyword,
            )

            try:
                response = Search(index=entity.get_index()).query(query).execute()
                documents = [hit.to_dict() for hit in response]
                self.search_results.extend(documents)
            except Exception as e:
                logger.error("Elastic search query execution failed due to %s", e)

        return self.search_results


