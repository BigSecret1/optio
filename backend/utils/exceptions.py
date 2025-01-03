from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError


def custom_validation_error(e, context = None):
    """
    This function is not giving as expected result, not in use. Issue will be fixed
    in future.
    """
    response = exception_handler(e, context)

    if isinstance(e, ValidationError) and response is not None:
        errors = e.detail
        parsed_errors = {
            field: [str(message) for message in messages]
            for field, messages in errors.items()
        }
        response.data = {
            "status": "error",
            "errors": parsed_errors
        }
    return response
