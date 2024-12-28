from rest_framework import serializers
from datetime import date, datetime

import logging
logging.basicConfig(level=logging.DEBUG)


class SubTaskSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255, required = True)
    due_date = serializers.DateField(required = False)
    comments = serializers.ListField(
        child=serializers.CharField(max_length=1000), required = False, allow_empty = True
    )
    description = serializers.CharField(required = False)
    task_status = serializers.ChoiceField(
        choices=['To Do', 'In Progress', 'Completed'], required = False, default = 'To Do'
    )
    created_time = serializers.DateTimeField(read_only = True, default = datetime.now)
    project_id = serializers.IntegerField(required = True, allow_null = False)
    parent_task_id = serializers.IntegerField(required = True, allow_null = False)

    """ 
    Customize the fields what to include and what to exclude while sending the response.
    If no field is passed then it will keep all by default.    
    """
    def __init__(self, *args, **kwargs):
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

    def validate(self, attrs):
        if attrs.get('parent_task_id') == attrs.get('id'):
            raise serializers.ValidationError("A task cannot be its own parent.")
        return attrs

    def to_representation(self, instance):
        # Get the default serialized representation
        representation = super().to_representation(instance)

        # Remove description if task_status is 'Completed'
        if representation.get('task_status') == 'Completed':
            representation.pop('description', None)

        # Add is_overdue field if due_date is in the past
        due_date = representation.get('due_date')
        if due_date and date.fromisoformat(due_date) < date.today():
            representation['is_overdue'] = True
        else:
            representation['is_overdue'] = False

        # Example: Exclude comments for tasks without a parent_task_id
        if not representation.get('parent_task_id'):
            representation.pop('comments', None)

        return representation
