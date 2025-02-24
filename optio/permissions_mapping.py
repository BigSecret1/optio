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

USERSPROFILE_PERMISSIONS = {
    "Admin": ["add_userprofile", "change_userprofile", "delete_userprofile",
              "view_userprofile"],
    "Alpha": ["add_userprofile", "view_userprofile"],
}

COMMENTS_PERMISSIONS = {
    "Admin": ["add_comment", "change_comment", "delete_comment", "view_comment"],
    "Alpha": ["add_comment", "change_comment", "delete_comment", "view_comment"],
    "Beta": ["add_comment", "change_comment", "view_comment", "delete_comment"],
    "Gamma": ["add_comment", "view_comment"]
}

# permission mappings for user groups on application level
APPS_PERMISSIONS = {
    "Admin": {
        "tasks": TASKS_PERMISSIONS["Admin"],
        "projects": PROJECTS_PERMISSIONS["Admin"],
        "users": USERSPROFILE_PERMISSIONS["Admin"],
        "comments": COMMENTS_PERMISSIONS["Admin"]
    },
    "Alpha": {
        "tasks": TASKS_PERMISSIONS["Alpha"],
        "projects": PROJECTS_PERMISSIONS["Alpha"],
        "users": USERSPROFILE_PERMISSIONS["Alpha"],
        "comments": COMMENTS_PERMISSIONS["Alpha"]
    },
    "Beta": {
        "tasks": TASKS_PERMISSIONS["Beta"],
        "projects": PROJECTS_PERMISSIONS["Beta"],
        "comments": COMMENTS_PERMISSIONS["Beta"]
    },
    "Gamma": {
        "tasks": TASKS_PERMISSIONS["Gamma"],
        "projects": PROJECTS_PERMISSIONS["Gamma"],
        "comments": COMMENTS_PERMISSIONS["Gamma"]
    }
}
