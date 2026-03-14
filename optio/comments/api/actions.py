from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from optio.comments.models import Comment
from optio.tasks.models import Task
from optio.comments.api.serializers import CommentSerializer


class CommentAPIAction:
    def __init__(self, organization, user):
        self.organization = organization
        self.user = user

    def _get_task(self, task_id):
        return get_object_or_404(
            Task,
            pk=task_id,
            organization=self.organization
        )

    def _get_comment(self, comment_id):
        return get_object_or_404(
            Comment,
            pk=comment_id,
            task__organization=self.organization
        )

    def list_comments(self, task_id):
        task = self._get_task(task_id)

        return CommentSerializer(
            task.comments.select_related("user").order_by("-created_at"),
            many=True
        ).data

    def get_comment(self, comment_id):
        comment = self._get_comment(comment_id)
        return CommentSerializer(comment).data

    def create_comment(self, task_id, data):
        task = self._get_task(task_id)

        serializer = CommentSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        serializer.save(
            user=self.user,
            task=task
        )

        return serializer.data

    def update_comment(self, comment_id, data):
        comment = self._get_comment(comment_id)

        if comment.user != self.user:
            raise ValidationError("You can only edit your own comment")

        serializer = CommentSerializer(
            comment,
            data=data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return serializer.data

    def delete_comment(self, comment_id):
        comment = self._get_comment(comment_id)

        if comment.user != self.user:
            raise ValidationError("You can only delete your own comment")

        comment.delete()

        return {"message": "Comment deleted successfully"}
