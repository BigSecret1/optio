from rest_framework import serializers

from datetime import date, datetime
from copy import deepcopy

from optio.projects.models import Project
from optio.tasks.models import Task


class BaseSerializer(serializers.ModelSerializer):
    comments = serializers.ListField(
        child=serializers.CharField(max_length=1000),
        required=False,
        allow_empty=True,
        error_messages={"max_length": "Each comment must not exceed 1000 characters."},
    )
    task_status = serializers.ChoiceField(
        choices=["To Do", "In Progress", "Completed"],
        required=False,
        default="To Do",
        error_messages={
            "invalid_choice": "Invalid status. Choose from: To Do, In Progress, Completed."},
    )
    created_time = serializers.DateTimeField(
        read_only=True, default=datetime.now, format="%Y-%m-%d %H:%M:%S"
    )

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'due_date', 'comments', 'description',
            'task_status', 'created_time', 'project', 'parent_task'
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


class SubTaskSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        extra_kwargs = deepcopy(getattr(BaseSerializer.Meta, 'extra_kwargs', {}))
        extra_kwargs['parent_task'] = {
            'queryset': Task.objects.all(),
            'required': True,
            'allow_null': False,
            'error_messages': {
                "invalid": "Parent Task ID must be a valid integer."
            }
        }

    def __init__(self, *args, **kwargs):
        """
        Customize the fields to include/exclude in the response.
        If no fields are passed, all fields are kept by default.
        """
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)
        if fields:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)

    def validate_due_date(self, value):
        if value and value < date.today():
            raise serializers.ValidationError("Due date cannot be in the past.")
        return value

    def validate_task_status(self, value):
        allowed_statuses = ['To Do', 'In Progress', 'Completed']
        if value not in allowed_statuses:
            raise serializers.ValidationError(
                f"Task status must be one of {allowed_statuses}.")
        return value

    def to_representation(self, instance):
        """
            Before sending Response to API call the data finally gets serialized
            b this method.
            It can add more properties or remove existing one from the data before sending
            the response
        """
        representation = super().to_representation(instance)

        due_date = representation.get('due_date')
        if due_date and date.fromisoformat(due_date) < date.today():
            representation['is_overdue'] = True
        else:
            representation['is_overdue'] = False

        return representation


class TaskSerializer(BaseSerializer):
    pass
