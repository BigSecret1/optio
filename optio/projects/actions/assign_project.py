import logging

from optio.users.models import UserProfile
from optio.projects.models import UserProject


def assign_project_to_admin(project):
    users_with_admin_role = UserProfile.objects.filter(groups__name="Admin")

    for user in users_with_admin_role:
        assign_project(user, project)

def revoke_user_project_access():
    pass

def assign_project_to_normal_user(user, project):
    assign_project(user, project)


def assign_project(user, project):
    try:
        UserProject.objects.create(user=user, project=project)
    except Exception as e:
        logging.error(f"Failed to assign project {project} to user {user}")
