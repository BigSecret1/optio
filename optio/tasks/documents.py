from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry

from optio.tasks.models import Task


@registry.register_document
class TaskDocument(Document):
    class Index:
        name = "tasks_index"

    class Django:
        model = Task
        fields = [
            "title",
            "task_status"
        ]
