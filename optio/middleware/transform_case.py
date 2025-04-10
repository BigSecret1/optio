from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

from rest_framework.response import Response

import logging
import json
import re


class CamelCaseToSnakeCaseMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.content_type == "application/json":
            try:
                body = json.loads(request.body)
                snake_case_body = {
                    self.camel_to_snake(key): value for key, value in body.items()
                }

                """
                Use ._body to not directly modify actual request body and used 
                cached body which is request._body
                """
                request._body = json.dumps(snake_case_body).encode("utf-8")
            except Exception as e:
                logging.error("Request body transformation failed: %s", str(e))

    def camel_to_snake(self, name: str):
        # https://djangosnippets.org/snippets/585/
        return (
            re.sub("(((?<=[a-z])[A-Z])|([A-Z](?![A-Z]|$)))", "_\\1", name).lower(

            ).strip("_")
        )


class SnakeCaseToCamelCaseMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if (
            response.get('Content-Type', '').startswith('application/json') and
            hasattr(response, 'content')
        ):
            try:
                data = json.loads(response.content)

                camel_case_data = self.convert_keys_to_camel_case(data)

                return Response(
                    camel_case_data, safe=False,
                    status=response.status_code
                )

            except Exception as e:
                logging.error("Response transformation failed: %s", str(e))

        return response

    def snake_to_camel(self, name: str) -> str:
        return re.sub(r"_([a-zA-Z])", lambda match: match.group(1).upper(), name)

    def convert_keys_to_camel_case(self, data):
        if isinstance(data, dict):
            return {
                self.snake_to_camel(key): self.convert_keys_to_camel_case(value)
                for key, value in data.items()
            }
        elif isinstance(data, list):
            return [self.convert_keys_to_camel_case(item) for item in data]
        else:
            return data
