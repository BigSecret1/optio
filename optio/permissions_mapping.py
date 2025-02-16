"""
For different model instances for each application this module contains permission
mapping for each user group.
"""

TASKS_PERMISSIONS = {
    "Admin": ["add_task", "change_task", "delete_task", "view_task"],
    "Alpha": ["add_task", "change_task", "delete_task", "view_task"],
    "Beta": ["add_task", "change_task", "view_task"],
    "Gamma": ["view_task"]
}

PROJECTS_PERMISSIONS = {
    "Admin": ["add_project", "change_project", "delete_project", "view_project"],
    "Alpha": ["add_project", "change_project", "delete_project", "view_project"],
    "Beta": ["add_project", "change_project", "view_project"],
    "Gamma": ["view_project"]
}

# permission mappings for all user groups on application level
APPS_PERMISSIONS = {
    "Admin": {
        "tasks": TASKS_PERMISSIONS["Admin"],
        "projects": PROJECTS_PERMISSIONS["Admin"]
    },
    "Alpha": {
        "tasks": TASKS_PERMISSIONS["Alpha"],
        "projects": PROJECTS_PERMISSIONS["Alpha"]
    },
    "Beta": {
        "tasks": TASKS_PERMISSIONS["Beta"],
        "projects": PROJECTS_PERMISSIONS["Beta"]
    }
}
