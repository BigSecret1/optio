from django.db import models
from tasks.models import Task


class Comments(models.Model):
    id = models.AutoField(primary_key = True)
    comment = models.TextField()
    task = models.ForeignObject(
        Task,
        on_delete = models.CASCADE,
        related_name = "comments",
        blank = False,
        null = False)
    created_at = models.DateTimeField(auto_now_add = True)


