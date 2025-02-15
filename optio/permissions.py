from django.contrib.auth.models import User


class Permission:
    """
    A centralized permission class which validates authorization for all users on
    application level permissions.
    """

    def __init__(self, user: User, app_label: str, model_instance: str):
        self.user = user
        self.app_label = app_label
        self.model_instance = model_instance

    def has_permission(self, action: str):
        permission_codename: str = f"{action}_{self.model_instance.lower()}"
        return self.user.has_perm(f"{self.app_lablel}.{permission_codename}")

    def has_delete_permission(self):
        return self.has_permission("delete")


def check_permission(user: User, app_label: str, model_instance: str, action: str):
    permission = Permission(user, app_label, model_instance)
    if action == "delete":
        return permission.has_delete_permission()
