from optio.users.models import UserProfile


def is_admin(user):
    user = UserProfile.objects.get(email=user.email)
    user_groups = user.groups.all()

    for group in user_groups:
        if group.name.lower() == "admin":
            return True
    return False
