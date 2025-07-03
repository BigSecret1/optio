import logging
import pandas as pd
from elasticsearch_dsl import Search, Q

from optio.common.es_query import ESQuery

logger = logging.getLogger(__name__)


class ProjectESQuery(ESQuery):
    index_to_search: str = "projects_index"
    search = Search(index=index_to_search)

    def __init__(self):
        self.query_text = ""
        self.search_results = []

    def find(self, text):
        if text is None:
            raise Exception("Please provide a text to search")
        self.query_text = text

        self.exact_match()
        self.prefix_match()
        self.substring_match()
        self.fuzzy_match()
        self.__remove_duplicate_search_results()

        return self.search_results

    def exact_match(self):
        q = Q('term', **{'name.raw': self.query_text})
        matched_results = self._execute_query(q)
        self.__add_to_search_results(matched_results)

    def prefix_match(self):
        q = Q('match_phrase_prefix', **{'name.prefix': self.query_text})
        matched_results = self._execute_query(q)
        self.__add_to_search_results(matched_results)

    def substring_match(self):
        q = Q('match', name=self.query_text)
        matched_results = self._execute_query(q)
        self.__add_to_search_results(matched_results)

    def fuzzy_match(self):
        q = Q('fuzzy', name={"value": self.query_text, "fuzziness": "AUTO"})
        matched_results = self._execute_query(q)
        self.__add_to_search_results(matched_results)

    def __add_to_search_results(self, results):
        self.search_results.extend(results)

    def __remove_duplicate_search_results(self):
        df = pd.DataFrame(self.search_results).drop_duplicates()
        self.search_results = df.where(pd.notna(df), None).to_dict(orient="records")

    def _execute_query(self, query):
        try:
            s = ProjectESQuery.search.query(query)
            response = s.execute()
            results = []
            for hit in response:
                results.append({
                    'id': hit.id,
                    'name': hit.name
                })
            return results
        except Exception as e:
            logger.error("Elastic search query failed with exception %s", str(e))
