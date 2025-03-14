from django.contrib.auth.models import User, Group

import logging


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
        print(
            f"Initiating permission check for user: {self.user} with permission code: {permission_codename}"
        )

        # Lookup in groups, user part of to see if user has required permission
        for group in self.user.groups.all():
            permissions = group.permissions.all()
            for permission in permissions:
                print(permission)
                if permission.codename == permission_codename:
                    return True
        return False

    def has_view_permission(self):
        return self.has_permission("view")

    def has_delete_permission(self):
        return self.has_permission("delete")

    def has_create_permission(self):
        return self.has_permission("add")


def check_permission(user: User, app_label: str, model_instance: str, action: str):
    permission = Permission(user, app_label, model_instance)

    if action == "create":
        return permission.has_create_permission()
    elif action == "delete":
        return permission.has_delete_permission()
    elif action == "view":
        return permission.has_view_permission()
