from django.contrib.auth.models import User, Group


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

        # Lookup in groups user part of to see if user has required permission
        for group in self.user.groups.all():
            permissions = group.permissions.all()
            for permission in permissions:
                print(f"Permission code is ,", permission_codename,
                      "and permission ""is ", permission.codename)
                if permission == permission_codename:
                    print(f"Yes {self.user.groups.all()} user has required permission")

        return False

    def has_delete_permission(self):
        return self.has_permission("delete")


def check_permission(user: User, app_label: str, model_instance: str, action: str):
    permission = Permission(user, app_label, model_instance)
    print(user)
    if action == "delete":
        return permission.has_delete_permission()
