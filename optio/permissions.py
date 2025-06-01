import logging
from django.contrib.auth.models import User, Group

logger = logging.getLogger(__name__)


class Permission:
    """
    A centralized permission class which validates authorization for all users on
    application-level permissions.
    """

    def __init__(self, user: User, app_label: str, model_instance: str):
        self.user = user
        self.app_label = app_label
        self.model_instance = model_instance

    def has_permission(self, action: str):
        permission_codename = f"{action}_{self.model_instance.lower()}"
        logger.info(
            f"[Permission Check] User: {self.user.email} | Action: {action} | "
            f"Permission: {permission_codename}"
        )

        # Lookup in groups the user is part of to see if they have the required permission
        for group in self.user.groups.all():
            logger.debug(f"Checking group '{group.name}' for permissions.")

            for permission in group.permissions.all():
                logger.debug(f"Found permission: {permission.codename}")
                if permission.codename == permission_codename:
                    logger.info(
                        f"[Permission Granted] User: {self.user.email} | Permission: {permission_codename}"
                    )
                    return True

        logger.warning(
            f"[Permission Denied] User: {self.user.email} | Missing Permission: {permission_codename}"
        )
        return False

    def has_view_permission(self):
        return self.has_permission("view")

    def has_delete_permission(self):
        return self.has_permission("delete")

    def has_create_permission(self):
        return self.has_permission("add")


def check_permission(user: User, app_label: str, model_instance: str, action: str):
    logger.info(f"[Permission Entry] Action: {action} | User: {user.email}")

    permission = Permission(user, app_label, model_instance)

    if action == "create":
        return permission.has_create_permission()
    elif action == "delete":
        return permission.has_delete_permission()
    elif action == "view":
        return permission.has_view_permission()
    else:
        logger.error(f"[Invalid Action] Action: {action} is not recognized.")
        return False
