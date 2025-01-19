from django_elasticsearch_dsl import Document, fields, Completion, Text
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import analyzer, tokenizer

from optio.tasks.models import Task
import logging


"""
Custom analyzer : Generates subsrings and tokenize them for faster search
Also it has filtering mechanism which makes it case insensitive(filter=lowercase)
"""
autocomplete_analyzer = analyzer('autocomplete_analyzer',
                                 tokenizer=tokenizer('trigram', 'ngram', min_gram=1,
                                                     max_gram=6),
                                 filter=['lowercase']
                                 )


@registry.register_document
class TaskDocument(Document):
    title = fields.TextField(required=True, analyzer=autocomplete_analyzer)
    title_suggest = fields.CompletionField()

    class Index:
        name = "tasks_index"

        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0,
                    'max_ngram_diff': 5
                    }

    class Django:
        model = Task
        fields = ["task_status"]

    def prepare_title_suggest(self, instance):
        """
        Generate the data for the `title_suggest` field, may be need to remove in
        future. Not needed
        """
        logging.info(f"Generating title suggestions for: {instance.title}")
        return {
            "input": instance.title.split() if instance.title else [],
            "weight": 1,
        }

    def prepare_title(self, instance):
        return instance.title
