from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import analyzer, tokenizer

from optio.users.models import UserProfile

prefix_analyzer = analyzer(
    'prefix_analyzer',
    tokenizer=tokenizer(
        'edge_ngram_tokenizer',
        'edge_ngram',
        min_gram=1,
        max_gram=20,
    ),
    filter=['lowercase']
)

substring_analyzer = analyzer(
    'substring_analyzer',
    tokenizer=tokenizer(
        'ngram_tokenizer',
        'ngram',
        min_gram=2,
        max_gram=20,
    ),
    filter=['lowercase']
)


@registry.register_document
class UserDocument(Document):
    first_name = fields.TextField(
        analyzer=substring_analyzer,
        search_analyzer=substring_analyzer,
        fields={
            'prefix': fields.TextField(
                analyzer=prefix_analyzer,
                search_analyzer=prefix_analyzer,
            ),
            'raw': fields.KeywordField(),
        }
    )

    class Index:
        name = 'users_index'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
            'max_ngram_diff': 18,
        }

    class Django:
        model = UserProfile
        fields = ['id', 'last_name', 'email']
