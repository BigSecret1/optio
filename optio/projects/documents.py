from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import analyzer, tokenizer

from optio.projects.models import Project
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
class ProjectDocument(Document):
    project_name = fields.TextField(
        required=True,
        analyzer=autocomplete_analyzer,
        search_analyzer=autocomplete_analyzer
    )
    # project_name_suggest = fields.CompletionField()

    class Index:
        name = "projects_index"

        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0,
                    'max_ngram_diff': 5
                    }

    class Django:
        model = Project
        fields = ["id"]

    # def prepare_project_name_suggest(self, instance):
    #     """
    #     Generate the data for the `title_suggest` field, may be need to remove in
    #     future. Not needed
    #     """
    #     logging.info(f"Generating project name suggestions for: {instance.name}")
    #     return {
    #         "input": instance.name.split() if instance.name else [],
    #         "weight": 1,
    #     }

    def prepare_project_name(self, instance):
        return instance.name
