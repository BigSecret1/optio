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
        default="To Do",
        error_messages={
            "invalid_choice": "Invalid status. Choose from: To Do, In Progress, Completed."},
    )
    created_time = serializers.DateTimeField(
        read_only=True, default=datetime.now, format="%Y-%m-%d %H:%M:%S"
    )
    assignee = UserSerializer(read_only=True)  # for response
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(),  # for input
        write_only=True,
        source='assignee'  # maps to the same field
    )
    project = ProjectSerializer()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'due_date', 'comments', 'description',
            'status', 'created_time', 'project', 'parent_task', 'assignee',
            'assignee_id'
        ]
        extra_kwargs = {
            'title': {
                'error_messages': {
                    "required": "Title is required.",
                    "max_length": "Title must not exceed 255 characters."
                }
            },
            'due_date': {
                'required': False,
                'allow_null': True,
                'error_messages': {"invalid": "Due date must be a valid date."}
            },
            'description': {
                'required': False,
                'allow_null': True,
                'error_messages': {"invalid": "Description must be valid text."}
            },
            'project': {
                'queryset': Project.objects.all(),
                'error_messages': {
                    "required": "Project ID is required.",
                    "invalid": "Project ID must be a valid integer."
                }
            },
            'parent_task': {
                'queryset': Task.objects.all(),
                'required': False,
                'allow_null': True,
                'error_messages': {
                    "invalid": "Parent Task ID must be a valid integer."
                }
            }
        }

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
