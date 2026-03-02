from django.db import models

from optio.projects.models import Project
from optio.users.models import UserProfile
from optio.organizations.models import Organization
from optio.models import BaseAuditModel


class Task(BaseAuditModel):
    title = models.CharField(max_length=255)
    due_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="tasks",
        db_column="project_id"
    )
    parent_task = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        related_name="sub_tasks",
        blank=True,
        null=True,
        db_column="parent_task_id"
    )
    assignee = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="assigned_tasks",
        blank=True,
        null=True,
        db_column="assignee_id"
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="tasks",
        db_column="organization_id"
    )

    class Meta:
        db_table = "optio_tasks"

    def __str__(self):
        return self.title
