import re
from django.utils.deprecation import MiddlewareMixin

import logging
import json

"""
Before processing request to views , it's a good practise to transform request body (
JSON body) to camel_case annotation
"""
class CamelCaseToSnakeCaseMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.content_type == "application/json":
            try:
                body = json.loads(request.body)
                snake_case_body = {
                    self.camel_to_snake(key): value for key, value in body.items()
                }

                """Use ._body to not directly modigy actual request body and used 
                cached body which is request._body"""
                request._body = json.dumps(snake_case_body).encode("utf-8")
            except Exception as e:
                logging.error("Request body transformation failed: %s", str(e))

    def camel_to_snake(self, name: str):
        # https://djangosnippets.org/snippets/585/
        return (
            re.sub("(((?<=[a-z])[A-Z])|([A-Z](?![A-Z]|$)))", "_\\1", name).lower(

            ).strip("_")
        )
