"""
For different model instances for each application this module contains permission
mapping for each user group.
"""

TASK_PERMISSIONS = {
    "Admin": ["add_task", "change_task", "delete_task", "view_task"],
    "Alpha": ["add_task", "change_task", "delete_task", "view_task"],
    "Beta": ["add_task", "change_task", "view_task"],
    "Gamma": ["view_task"]
}

PROJECT_PERMISSIONS = TASK_PERMISSIONS

# permission mappings for all user groups on application level
APPS_PERMISSIONS = {
    "Admin": {
        "optiotasks": TASK_PERMISSIONS["Admin"],
        "optioprojects": PROJECT_PERMISSIONS["Admin"]
    }
}
