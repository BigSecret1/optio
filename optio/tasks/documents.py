from django_elasticsearch_dsl import Document, Completion, Text
from django_elasticsearch_dsl.registries import registry

from optio.tasks.models import Task


@registry.register_document
class TaskDocument(Document):
    task_title = Text(analyzer = "standard")
    task_title_suggest = Completion()

    class Index:
        name = "tasks_index"

    class Django:
        model = Task
        fields = [
            "title",
            "task_status"
        ]
