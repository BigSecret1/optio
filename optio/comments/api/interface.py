from optio.comments.models import Comment
from optio.comments.api.actions.comment import CommentAPIAction


class CommentInterface:
    @staticmethod
    def get_comments(task_id: int):
        return CommentAPIAction.fetch_all_comments(task_id)




 







