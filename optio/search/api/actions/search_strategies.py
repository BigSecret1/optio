from abc import ABC, abstractmethod
from elasticsearch_dsl import Q


class SearchStrategy(ABC):
    @abstractmethod
    def build_query(
        self,
        search_field: str,
        search_keyword: str,
        organization_id: int
    ):
        pass


class PrefixSearchStrategy(SearchStrategy):
    def build_query(self, search_field: str, search_keyword: str, organization_id: int):
        return Q(
            'bool',
            must=[
                Q(
                    'match_phrase_prefix',
                    **{search_field: search_keyword}
                )
            ],
            filter=[
                Q('term', organization_ids=organization_id)
            ]
        )


class SubstringSearchStrategy(SearchStrategy):
    def build_query(self, search_field: str, search_keyword: str, organization_id: int):
        return Q(
            'bool',
            must=[
                Q(
                    'wildcard',
                    **{f'{search_field}.keyword': f'*{search_keyword}*'}
                )
            ],
            filter=[
                Q('term', organization_ids=organization_id)
            ]
        )


class ExactSearchStrategy(SearchStrategy):
    def build_query(self, search_field: str, search_keyword: str, organization_id: int):
        return Q(
            'bool',
            must=[
                Q(
                    'term',
                    **{f'{search_field}.keyword': search_keyword}
                )
            ],
            filter=[
                Q('term', organization_ids=organization_id)
            ]
        )


class FuzzySearchStrategy(SearchStrategy):
    def build_query(self, search_field: str, search_keyword: str, organization_id: int):
        return Q(
            'bool',
            must=[
                Q(
                    'fuzzy',
                    **{
                        search_field: {
                            'value': search_keyword,
                            'fuzziness': 'AUTO'
                        }
                    }
                )
            ],
            filter=[
                Q('term', organization_ids=organization_id)
            ]
        )