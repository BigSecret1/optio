from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    subtasks = models.JSONField(default=list)  # Assuming subtasks are stored as JSON
    due_date = models.DateField(null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    task_status = models.CharField(max_length=20, default='To Do')

