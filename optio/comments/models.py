from django.db import models
from optio.tasks.models import Task
from optio.users.models import UserProfile
from optio.models import BaseAuditModel


class Comment(BaseAuditModel):
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

    class Meta:
        db_table = "optio_comments"
