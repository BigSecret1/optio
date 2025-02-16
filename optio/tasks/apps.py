from django.apps import AppConfig


class TasksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = "optio.tasks"
    app_label = "optiotasks"  # this is not useful need to remove soon
