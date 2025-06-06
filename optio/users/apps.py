from django.apps import AppConfig
from django.db.models.signals import post_migrate


class ProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = "optio.users"
    app_label = "optiousers"

    def ready(self):
        """Trigger signal post migration to create groups and assign permissions to groups"""
        from optio.users.signals import create_groups, assign_permissions_to_groups
        post_migrate.connect(create_groups, sender=self.name)
        post_migrate.connect(assign_permissions_to_groups, sender=self.name)
