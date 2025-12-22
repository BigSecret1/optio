from optio.comments.models import Comment
from optio.comments.api.actions.comment import CommentAPIAction


class CommentInterface:
    @staticmethod
    def get_comments(task_id: int):
        print("interface received task id ", task_id)
        return CommentAPIAction.fetch_all_comments(task_id)
