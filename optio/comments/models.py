from django.db import models
from optio.tasks.models import Task


class Comment(models.Model):
    comment = models.TextField()
    task = models.ForeignKey(
        Task,
        db_column="task_id",
        on_delete=models.CASCADE,
        related_name="comment",
        blank=False,
        null=False
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "optio_comments"
