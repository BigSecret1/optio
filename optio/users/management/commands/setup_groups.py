from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.apps import apps
from typing import Dict, List, Iterator
from optio.permissions_mapping import APPS_PERMISSIONS
from django.db.models import Model
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Create user groups and assign permissions based on custom RBAC mapping."

    def handle(self, *args, **options):
        self.create_groups()
        self.assign_permissions()

    def create_groups(self):
        group_names = ["Admin", "Alpha", "Beta", "Gamma"]

        for group_name in group_names:
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                logger.info(f"Created group: {group_name}")
            else:
                logger.info(f"Group already exists: {group_name}")

    def assign_permissions(self):
        for group_name, apps_permissions in APPS_PERMISSIONS.items():
            logger.info(f"Assigning app permissions to {group_name} group")
            logger.info("App Permissions: %s", apps_permissions)
            self.assign_apps_permissions_to_group(group_name, apps_permissions)

    def assign_apps_permissions_to_group(self, group_name: str, apps_permissions: Dict):
        group, _ = Group.objects.get_or_create(name=group_name)
        group.permissions.clear()

        for app_label, perm_codenames in apps_permissions.items():
            try:
                self.assign_permissions_to_group_on_models(group, app_label, perm_codenames)
            except ValueError as e:
                logger.error("%s", e)

    def assign_permissions_to_group_on_models(
        self,
        group: Group,
        app_label: str,
        perm_codenames: List[str]
    ):
        try:
            models: Iterator[Model] = apps.get_app_config(app_label).get_models()
        except LookupError:
            raise ValueError(f"App '{app_label}' not found or not loaded.")

        for model in models:
            content_type: ContentType = ContentType.objects.get_for_model(model)

            for codename in perm_codenames:
                try:
                    permission: Permission = Permission.objects.get(
                        codename=codename,
                        content_type=content_type
                    )
                    group.permissions.add(permission)
                    logger.info(f"Assigned {codename} to group {group.name}")
                except Permission.DoesNotExist:
                    raise ValueError(
                        f"Permission with codename '{codename}' and content type '{content_type}' not found."
                    )
