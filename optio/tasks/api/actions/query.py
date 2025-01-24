from optio.common.es_query import ESQuery

from rest_framework.request import Request

from typing import Dict, List, Optional
import logging

from elasticsearch_dsl import Search, Q


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

        try:
            logging.info("Starting search operation for task title input : '%s' ",
                         self.search_text)
            self.exact_match()
            self.prefix_match()
            self.substring_match()
            self.fuzzy_match()

            self.__show_search_results()
            return self.search_results
        except Exception as e:
            logging.error("Exception occured while searching task title : %s", str(e))

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
        self.__add_to_search_results(matched_results, "exact_match")

    def prefix_match(self):
        search = TaskESQuery.search.suggest('title-suggestion', self.search_text,
                                            completion={"field": 'title_suggest'})

        matched_result = search.execute().to_dict()

        """Query not returning results in hit field so using custom adding logic"""
        if 'suggest' in matched_result:
            for suggestion in matched_result["suggest"]["title-suggestion"]:
                for option in suggestion["options"]:
                    record = {}
                    record["title"] = option["_source"]["title"]
                    record["id"] = option["_id"]
                    record["type"] = "prefix"
                    self.search_results.append(record)
        else:
            logging.info("No suggestions found.")

    """
    Elastic search Wild card search query is a good option to start with for 
    substring march but increase in performance issue would indicate to introduce a good appraoch
    """
    def substring_match(self):
        query = Q("wildcard", title={"value": "*tting", "case_insensitive": True})
        search = TaskESQuery.search.query(query)

        matched_results = search.execute()
        self.__add_to_search_results(matched_results, "substring match")

    def fuzzy_match(self):
        query = Q(
            "fuzzy",
            title={
                "value": "wh",
                "fuzziness": "2"
            }
        )
        search = TaskESQuery.search.query(query)
        response  = search.source(["title"]).execute()

        # response = search.execute()

        for hit in response:
            print(f"ID: {hit.meta.id}, Title: {hit.title}")

    def __add_to_search_results(self, results, type):
        for hit in results:
            record = {}
            record["id"] = hit.meta.id
            record["title"] = hit.title
            record["type"] = type
            self.search_results.append(record)

    def __show_search_results(self):
        for record in self.search_results:
            print(f"\n type : {record["type"]} | id : {record["id"]} | task title :"
                  f" {record["title"]}")

    def __remove_duplicate_search_results(self):
        pass
