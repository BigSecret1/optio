from rest_framework import serializers
from optio.projects.models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name", "description", "updated_at", "created_at"]
        read_only_fields = ["id", "last_updated", "created_at"]



