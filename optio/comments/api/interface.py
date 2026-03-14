from optio.comments.models import Comment
from optio.comments.api.serializers import CommentSerializer


class CommentInterface:
    @staticmethod
    def get_comments(task_id: int):
        comments = (
            Comment.objects
            .filter(task_id=task_id)
            .select_related("user")
            .order_by("-created_at")
        )
        return CommentSerializer(comments, many=True).data
