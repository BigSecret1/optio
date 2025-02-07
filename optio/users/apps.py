from django.apps import AppConfig
from django.db.models.signals import post_migrate


class ProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = "optio.users"
    app_label = "optiousers"

    def ready(self):
        from optio.users.signals import create_groups
        post_migrate.connect(create_groups, sender=self.name)
