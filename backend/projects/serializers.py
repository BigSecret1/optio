from rest_framework import serializers

class ProjectSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    last_updated = serializers.DateTimeField()
    stars = serializers.IntegerField(default=0)
    description = serializers.CharField(style={'base_template': 'textarea.html'})
