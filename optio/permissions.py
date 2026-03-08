import logging

logger = logging.getLogger(__name__)


class MethodPermissionMixin:
    permission_classes = []
    permission_classes_by_method = {}

    def get_permissions(self):
        classes = self.permission_classes_by_method.get(
            self.request.method,
            self.permission_classes,
        )
        return [permission() for permission in classes]
