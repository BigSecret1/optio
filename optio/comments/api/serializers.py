from rest_framework import serializers
from optio.comments.models import Comment


class CommentSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id',
            'comment',
            'task',
            'created_at',
            'user',
            'first_name',
            'last_name'
        ]
        read_only_fields = ['user']
