import logging
import pandas as pd
from elasticsearch_dsl import Search, Q

from optio.common.es_query import ESQuery

logger = logging.getLogger(__name__)


class TaskESQuery(ESQuery):
    index_to_search: str = "tasks_index"
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
        q = Q('term', **{'title.raw': self.query_text})
        matched_results = self._execute_query(q)
        self.__add_to_search_results(matched_results)

    def prefix_match(self):
        q = Q('match_phrase_prefix', **{'title.prefix': self.query_text})
        matched_results = self._execute_query(q)
        self.__add_to_search_results(matched_results)

    def substring_match(self):
        q = Q('match', title=self.query_text)
        matched_results = self._execute_query(q)
        self.__add_to_search_results(matched_results)

    def fuzzy_match(self):
        q = Q('fuzzy', title={"value": self.query_text, "fuzziness": "AUTO"})
        matched_results = self._execute_query(q)
        self.__add_to_search_results(matched_results)

    def __add_to_search_results(self, results):
        self.search_results.extend(results)

    def __remove_duplicate_search_results(self):
        df = pd.DataFrame(self.search_results).drop_duplicates()
        self.search_results = df.where(pd.notna(df), None).to_dict(orient="records")

    def _execute_query(self, query):
        try:
            s = TaskESQuery.search.query(query)
            response = s.execute()
            results = []
            for hit in response:
                results.append({
                    'id': hit.id,
                    'name': hit.title
                })
            return results
        except Exception as e:
            logger.error("Elastic search query failed with exception %s", str(e))
