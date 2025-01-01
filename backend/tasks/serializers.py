from rest_framework import serializers

from projects.models import Project
from tasks.models import Task

from datetime import date, datetime
import logging
logging.basicConfig(level=logging.DEBUG)


class SubTaskSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(
        max_length=255,
        required=True,
        error_messages={"required": "Title is required.", "max_length": "Title must not exceed 255 characters."},
    )
    due_date = serializers.DateField(
        required=False,
        allow_null=True,
        error_messages={"invalid": "Due date must be a valid date."},
    )
    comments = serializers.ListField(
        child=serializers.CharField(max_length=1000),
        required=False,
        allow_empty=True,
        error_messages={"max_length": "Each comment must not exceed 1000 characters."},
    )
    description = serializers.CharField(
        required=False,
        allow_null=True,
        error_messages={"invalid": "Description must be valid text."},
    )
    task_status = serializers.ChoiceField(
        choices=["To Do", "In Progress", "Completed"],
        required=False,
        default="To Do",
        error_messages={"invalid_choice": "Invalid status. Choose from: To Do, In Progress, Completed."},
    )
    created_time = serializers.DateTimeField(
        read_only=True, default=datetime.now, format="%Y-%m-%d %H:%M:%S"
    )
    project = serializers.PrimaryKeyRelatedField(
        queryset= Project.objects.all(),
        error_messages={
            "required": "Project ID is required.",
            "invalid": "Project ID must be a valid integer."
        }
    )
    parent_task = serializers.PrimaryKeyRelatedField(
        queryset=Task.objects.all(),
        required=False,
        allow_null=True,
        error_messages={
            "invalid": "Parent Task ID must be a valid integer."
        }
    )

    def __init__(self, *args, **kwargs):
        """
            Customize the fields what to include and what to exclude while sending the response.
            If no field is passed then it will keep all by default.
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
            raise serializers.ValidationError(f"Task status must be one of {allowed_statuses}.")
        else:
            return value

    """
    This method is responsible for further refining the data before returning in the 
    API resonse
    """
    def to_representation(self, instance):
        # Get the default serialized representation
        representation = super().to_representation(instance)

        if representation.get('task_status') == 'Completed':
            representation.pop('description', None)

        due_date = representation.get('due_date')
        if due_date and date.fromisoformat(due_date) < date.today():
            representation['is_overdue'] = True
        else:
            representation['is_overdue'] = False

        if not representation.get('parent_task_id'):
            representation.pop('comments', None)

        return representation
