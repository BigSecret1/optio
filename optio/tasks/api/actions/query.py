from optio.common.es_query import ESQuery

from rest_framework.request import Request

from typing import Dict, List, Optional
import logging

from elasticsearch_dsl import Search, Q, connections


class TaskESQuery(ESQuery):
    index_to_search: str = "tasks_index"
    search = Search(index=index_to_search)

    def __init__(self):
        self.search_text: str = ""
        self.search_results: List[Dict] = []

    def execute(self, query_data: Request) -> Optional[List[Dict]]:
        if "title" in query_data:
            self.search_text = query_data["title"]
        else:
            return {"error_message": "Field title is required"}

        self.exact_match()
        self.prefix_match()
        self.fuzzy_match()

        return self.search_results

    def exact_match(self):
        query = Q(
            "match_phrase",
            title=self.search_text
        )

        """
        To avoid fetching partial results (for e.g. 1000 or even 10) as the elastic 
        search dsl docs says
        """
        TaskESQuery.search.extra(track_total_hits=False)

        matched_results = TaskESQuery.search.query(query).execute()
        self.__add_to_search_results(matched_results)

    def prefix_match(self):
        search = TaskESQuery.search.suggest('title-suggestion', self.search_text,
                                            completion={"field": 'title_suggest'})

        matched_result = search.execute().to_dict()

        """Query not returning results in hit field so using custom adding logic"""
        if 'suggest' in matched_result:
            for suggestion in matched_result['suggest']['title-suggestion']:
                for option in suggestion['options']:
                    record = {}
                    record["title"] = option["_source"]["title"]
                    record["id"] = option["_id"]
                    self.search_results.append(record)
                    self.show_record(record, "prefix")
        else:
            logging.info("No suggestions found.")

    def fuzzy_match(self):
        pass

    def __add_to_search_results(self, results):
        for hit in results:
            record = {}
            record["id"] = hit.meta.id
            record["title"] = hit.title
            self.search_results.append(record)
            self.show_record(record, exact)

        # print(self.search_results)

    def show_record(self, record, type):
        print("\n", type)
        print(f"\n id : {record["id"]} task title : {record["title"]}")
