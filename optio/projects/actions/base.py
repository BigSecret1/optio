from optio.projects.models import Project


def get_projects_for_admin():
    projects = Project.objects.all()
    return projects


def get_projects_for_normal_user(user):
    projects = Project.objects.filter(userproject__user=user)
    return projects
