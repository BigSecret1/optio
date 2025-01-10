from rest_framework import serializers

from comments.models import Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'comment', 'task', 'created_at']

        extra_kwargs = {
            "comment": {
                "required": True,
                "allow_null": False,
                "error_messages": {
                    "required": "The comment field is required.",
                    "null": "Comment cannot be null."
                }
            }
        }

    def validate(self, attrs):
        if self.partial:
            if 'comment' not in self.initial_data:
                raise serializers.ValidationError(
                    {"comment": "This property is missing in request body"})
        return attrs
