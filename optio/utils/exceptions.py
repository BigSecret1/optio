from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError

auth_failed_error: str = "User authentication failed, invalid credentials"
perm_required_error: str = ("User don't have required permission to perform this "
                            "action")


class CommentUpdateException(IndexError):
    pass
