from rest_framework import serializers
from optio.projects.models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'last_updated']
        read_only_fields = ['id', 'last_updated']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return {
            "id": rep["id"],
            "name": rep["name"]
        }
