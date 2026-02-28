from abc import ABC, abstractmethod
from elasticsearch_dsl import Q


class SearchStrategy(ABC):
    @abstractmethod
    def build_query(self, search_keyword: str, search_field: str):
        pass


class PrefixSearchStrategy(SearchStrategy):
    def build_query(self, search_field: str, search_keyword: str):
        return Q(
            'match_phrase_prefix',
            **{search_field: search_keyword}
        )


class SubstringSearchStrategy(SearchStrategy):
    def build_query(self, search_field: str, search_keyword: str):
        return Q(
            'wildcard',
            **{f"{search_field}.keyword": f"*{search_keyword}*"}
        )


class ExactSearchStrategy(SearchStrategy):
    def build_query(self, search_field: str, search_keyword: str):
        return Q(
            'term',
            **{f"{search_field}.keyword": search_keyword}
        )


class FuzzySearchStrategy(SearchStrategy):
    def build_query(self, search_field: str, search_keyword: str):
        return Q(
            'fuzzy',
            **{
                search_field: {
                    'value': search_keyword,
                    'fuzziness': "AUTO"
                }
            }
        )
