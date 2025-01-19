import re
from django.utils.deprecation import MiddlewareMixin

import logging

"""
Before processing request to views , it's better to transform request body (JSON body)
to camel_case annotation
"""


class CamelCaseToSnakeCaseMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.content_type == "application/json":
            try:
                import json
                body = json.loads(request.body)
                snake_case_body = {
                    self.camel_to_snake(key): value for key, value in body.items()
                }
                request._body = json.dumps(snake_case_body)  # Update request body
            except Exception as e:
                logging.error("Request body transformation failed due to exception "
                              "%s", str(e))

    def camel_to_snake(self, name: str):
        # https://djangosnippets.org/snippets/585/
        return (
            re.sub("(((?<=[a-z])[A-Z])|([A-Z](?![A-Z]|$)))", "_\\1", name).lower(

            ).strip("_")
        )
