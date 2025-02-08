from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_migrate
from django.contrib.auth.models import Group, Permission
from django.dispatch import receiver
from django.apps import apps
from django.db.models import Model

from optio.permissions_mapping import APPS_PERMISSIONS

from typing import Dict, List, Iterator


@receiver(post_migrate)
def create_groups(sender, **kwargs):
    if sender == "optio.users":
        group_names = ["Admin", "Alpha", "Beta", "Gamma"]

        for group_name in group_names:
            Group.objects.get_or_create(name=group_name)


@receiver(post_migrate)
def assign_permissions_to_groups(sender, **kwargs):
    """
    Assign permissions to all model instances of different applications baseed on
    INSTANCES_PERMISSIONS.
    As permission in optio is on app level for each user group, custom persmission
    mapping has to be used for desired RBAC.
    """

    if sender.name == "optio.users":
        for group_name, apps_permissions in APPS_PERMISSIONS.items():
            print(group_name, apps_permissions)
            assign_apps_permissions_to_group(group_name, apps_permissions)


def assign_apps_permissions_to_group(group_name: str, apps_permissions: Dict):
    group: Group
    created: bool

    group, created = Group.objects.get_or_create(name=group_name)
    group.permissions.clear()

    for app_label, app_permissions in apps_permissions.items():
        try:
            print(app_label, app_permissions)
            assign_permissions_to_group_on_models(group, app_label, app_permissions)
        except LookupError:
            print(f"App '{app_label}' not found.")


def assign_permissions_to_group_on_models(
    group: Group,
    app_label: str,
    perm_codenames: List[str]
):
    models: Iterator[Model] = apps.get_app_config(app_label).get_models()

    for model in models:
        content_type: ContentType = ContentType.objects.get_for_model(model)
        print("content_type ", content_type)

        for codename in perm_codenames:
            try:
                permission: Permission = Permission.objects.get(
                    codename=codename,
                    content_type
                    =content_type)
                print("group -> ", group, "permission -> ", permission)
                group.permissions.add(permission)
            except Permission.DoesNotExist:
                print(
                    f"Permission '{codename}' not found in app '{app_label}' for model '{model.__name__}'")
