import logging

from django.db import transaction

from optio.users.models import UserProfile
from optio.projects.models import UserProject
from optio.projects.models import Project


def assign_project_to_admin(project):
    users_with_admin_role = UserProfile.objects.filter(groups__name="Admin")

    for user in users_with_admin_role:
        assign_project(user, project)


def assign_project_to_normal_user(user, project):
    assign_project(user, project)

@transaction.atomic
def assign_project_to_users(project_id : int, user_ids = []):
    project = Project.objects.get(id=project_id)
    for user_id in user_ids:
        user = UserProfile.objects.get(id=user_id)
        assign_project(user, project)


def assign_project(user, project):
    try:
        UserProject.objects.create(user=user, project=project)
    except Exception as e:
        logging.error(f"Failed to assign project {project} to user {user}")
