from django.db import models
from django.contrib.postgres.fields import ArrayField
from projects.models import Project


class Task(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    subtasks = ArrayField(
        models.CharField(max_length=200),
        blank=True,
        default=list
    )
    due_date = models.DateField(blank=True, null=True)
    comments = ArrayField(
        models.CharField(max_length=200),
        blank=True,
        default=list
    )
    description = models.TextField(blank=True, null=True)
    task_status = models.CharField(max_length=50, blank=True, null=True)
    created_time = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="tasks",
        db_column = "project_id"
    )
    parent_task = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        related_name="sub_tasks",
        blank=True,
        null=True,
        db_column="parent_task_id"
    )

    class Meta:
        db_table = "tasks"
        managed = False

    def __str__(self):
        return self.title
