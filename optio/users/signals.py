from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_migrate
from django.contrib.auth.models import Group, Permission
from django.dispatch import receiver
from django.apps import apps
from django.db.models import Model

from optio.permissions_mapping import APPS_PERMISSIONS

from typing import Dict, List, Iterator
import logging

logger = logging.getLogger(__name__)


@receiver(post_migrate)
def create_groups(sender, **kwargs):
    logger.info("[Post Migration Signal]: Signal received to create auth groups")
    if sender == "optio.users":
        group_names = ["Admin", "Alpha", "Beta", "Gamma"]

        for group_name in group_names:
            logger.debug("Creating %s group", group_name)
            Group.objects.get_or_create(name=group_name)


@receiver(post_migrate)
def assign_permissions_to_groups(sender, **kwargs):
    """
    Assign permissions to all model instances of different applications based on
    INSTANCES_PERMISSIONS.
    As permission in optio is on app level for each user group, custom persmission
    mapping has to be used for desired RBAC.
    From Permission mapping class each group is pulled with respective permission and then assignment is done.
    """

    if sender.name == "optio.users":
        for group_name, apps_permissions in APPS_PERMISSIONS.items():
            logging.info(f"Assigning app permission to {group_name} group")
            logging.info("App Permissions %s", apps_permissions)
            assign_apps_permissions_to_group(group_name, apps_permissions)


def assign_apps_permissions_to_group(group_name: str, apps_permissions: Dict):
    group: Group
    created: bool

    group, created = Group.objects.get_or_create(name=group_name)
    group.permissions.clear()

    for app_label, app_permissions in apps_permissions.items():
        try:
            assign_permissions_to_group_on_models(group, app_label, app_permissions)
        except ValueError as e:
            logging.error("%s", e)


def assign_permissions_to_group_on_models(
    group: Group,
    app_label: str,
    perm_codenames: List[str]
):
    models: Iterator[Model] = apps.get_app_config(app_label).get_models()

    for model in models:
        content_type: ContentType = ContentType.objects.get_for_model(model)

        for codename in perm_codenames:
            try:
                print(codename, content_type)
                permission: Permission = Permission.objects.get(
                    codename=codename,
                    content_type
                    =content_type
                )
                group.permissions.add(permission)
            except Permission.DoesNotExist:
                raise ValueError(
                    f"Permission with codename {codename} and content type {content_type} not found."
                )
