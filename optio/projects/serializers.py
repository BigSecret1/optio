from rest_framework import serializers

class ProjectSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    project_updated = serializers.DateTimeField()
    stars = serializers.IntegerField(default=0)
    project_description = serializers.CharField(style={'base_template':
                                                           'textarea.html'})
