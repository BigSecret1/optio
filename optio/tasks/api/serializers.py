from rest_framework import serializers

from datetime import date, datetime
from copy import deepcopy

from optio.projects.models import Project
from optio.tasks.models import Task
from optio.projects.serializers import ProjectSerializer
from optio.users.serializers import UserSerializer
from optio.users.models import UserProfile
from optio.comments.api.interface import CommentInterface


class BaseSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()

    status = serializers.ChoiceField(
        choices=["To Do", "In Progress", "Completed"],
        required=False,
        default="To Do"
    )

    created_time = serializers.DateTimeField(
        read_only=True,
        format="%Y-%m-%d %H:%M:%S"
    )

    project = ProjectSerializer(read_only=True)
    assignee = UserSerializer(read_only=True)

    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        write_only=True,
        source="project"
    )

    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(),
        write_only=True,
        source="assignee",
        required=False,
        allow_null=True
    )

    parent_task = serializers.PrimaryKeyRelatedField(
        queryset=Task.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "due_date",
            "status",
            "created_time",
            "comments",
            "project",
            "project_id",
            "assignee",
            "assignee_id",
            "parent_task"
        ]

    def create(self, validated_data):
        return Task.objects.create(**validated_data)

    def get_comments(self, obj):
        return CommentInterface.get_comments(obj.id)


class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['created_time']


class TaskSerializer(BaseSerializer):
    pass
