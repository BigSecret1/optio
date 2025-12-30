from django.db import models
from optio.tasks.models import Task
from optio.users.models import UserProfile


class Comment(models.Model):
    comment = models.TextField()

    task = models.ForeignKey(
        Task,
        db_column="task_id",
        on_delete=models.CASCADE,
        related_name="comments"
    )

    user = models.ForeignKey(
        UserProfile,
        db_column="user_id",
        on_delete=models.CASCADE,
        related_name="comments"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "optio_comments"
