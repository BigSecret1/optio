from rest_framework import serializers

from optio.projects.models import Project
from optio.tasks.models import Task
from optio.projects.serializers import ProjectSerializer
from optio.users.api.serializers import UserSerializer
from optio.users.models import UserProfile
from optio.comments.api.interface import CommentInterface


class TaskSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    sub_tasks = serializers.SerializerMethodField()

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
        source="project"
    )

    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(),
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
        fields = "__all__"

    write_only = ["project_id", "assignee_id"]

    def create(self, validated_data):
        """Better to remove this in future as it's part of Action Layer"""
        return Task.objects.create(**validated_data)

    def get_comments(self, obj):
        return CommentInterface.get_comments(obj.id)

    def get_sub_tasks(self, obj):
        childrens = obj.sub_tasks.all()
        return TaskSerializer(childrens, many=True).data
