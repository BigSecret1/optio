from optio.common.es_query import ESQuery


class TaskESQuery(ESQuery):
    def __init__(self):
        self.search_text: str = ""

    def set_search_text(self, text: str):
        self.search_text = text

    def execute(self):
        self.exact_match()
        self.prefix_substring_match()
        self.fuzzy_match()

    def exact_match(self):
        pass

    def prefix_substring_match(self):
        pass

    def fuzzy_match(self):
        pass
