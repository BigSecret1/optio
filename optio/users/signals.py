from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group


@receiver(post_migrate)
def create_groups(sender, **kwargs):
    print(sender.name)
    if sender.name == 'optio.users':
        group_names = ["Admin", "Alpha", "Beta", "Gamma"]

        for group_name in group_names:
            Group.objects.get_or_create(name=group_name)


@receiver()
