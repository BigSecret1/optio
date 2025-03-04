from django.contrib.admin.templatetags.admin_list import results

from optio.common.es_query import ESQuery

from rest_framework.request import Request

from typing import Dict, List, Optional
import logging
import pandas as pd

from elasticsearch_dsl import Search, Q


class ProjectESQuery(ESQuery):
    index_to_search: str = "projects_index"
    search = Search(index=index_to_search)

    def __init__(self):
        self.search_text: str = ""
        self.search_results: List[Dict] = []

    def execute(self, query_data: Request) -> Optional[List[Dict]]:
        if "project_name" in query_data:
            self.search_text = query_data["project_name"]
        else:
            return {"error_message": "Field project name is required"}

        try:
            logging.info("Starting search operation for project name input : '%s' ",
                         self.search_text)
            self.exact_match()
            self.prefix_match()
            self.substring_match()
            self.fuzzy_match()

            self.__remove_duplicate_search_results()
            self.__show_search_results()

            return self.search_results
        except Exception as e:
            logging.error("Exception occured while searching project name : %s", e)

    def exact_match(self):
        query = Q(
            "match_phrase",
            project_name=self.search_text
        )

        """
        To avoid fetching partial results (for e.g. 1000 or even 10) as the elastic 
        search dsl docs says
        """
        ProjectESQuery.search.extra(track_total_hits=False)

        matched_results = ProjectESQuery.search.query(query).execute()
        self.__add_to_search_results(matched_results)

    def prefix_match(self):
        search = ProjectESQuery.search.suggest('project-name-suggestion',
                                               self.search_text,
                                               completion={
                                                   "field": 'project_name_suggest'})

        matched_result = search.execute().to_dict()

        """Query not returning results in hit field so using custom adding logic"""
        if 'suggest' in matched_result:
            for suggestion in matched_result["suggest"]["project-name-suggestion"]:
                for option in suggestion["options"]:
                    record = {}
                    record["id"] = option["_id"]
                    record["project_name"] = option["_source"]["project_name"]
                    self.search_results.append(record)
        else:
            logging.info("No suggestions found.")

    """
    Elastic search Wild card search query is a good option to start with for 
    substring march but increase in performance issue would indicate to introduce a good appraoch
    """

    def substring_match(self):
        search_patterns = [
            f"*{self.search_text}",
            f"{self.search_text}*",
            f"*{self.search_text}*"
        ]

        for pattern in search_patterns:
            query = Q("wildcard", title={"value": pattern, "case_insensitive": True})
            search = ProjectESQuery.search.query(query)

            matched_results = search.execute()
            self.__add_to_search_results(matched_results)

    def fuzzy_match(self):
        query = Q(
            "fuzzy",
            title={
                "value": self.search_text,
                "fuzziness": "2"
            }
        )
        search = ProjectESQuery.search.query(query)
        matched_results = search.source(["project_name"]).execute()
        self.__add_to_search_results(matched_results)

    def __add_to_search_results(self, results):
        for hit in results:
            record = {}
            record["id"] = hit.meta.id
            record["project_name"] = hit.project_name
            self.search_results.append(record)

    def __show_search_results(self):
        for record in self.search_results:
            print(f"\n id : {record["id"]} | project name : {record["project_name"]}")

    def __remove_duplicate_search_results(self):
        df = pd.DataFrame(self.search_results).drop_duplicates()
        self.search_results = df.where(pd.notna(df), None).to_dict(orient="records")
