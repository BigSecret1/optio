from django_elasticsearch_dsl import Document, fields, Completion, Text
from django_elasticsearch_dsl.registries import registry

from optio.tasks.models import Task
import logging


@registry.register_document
class TaskDocument(Document):
    title_suggest = fields.CompletionField()

    class Index:
        name = "tasks_index"

        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Task
        fields = ["title", "task_status"]

    def prepare_title_suggest(self, instance):
        """
        Generate the data for the `title_suggest` field.
        """
        logging.info(f"Generating title suggestions for: {instance.title}")
        return {
            "input": instance.title.split() if instance.title else [],
            "weight": 1,
        }
