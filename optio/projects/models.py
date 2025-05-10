from django.db import models
from optio.users.models import UserProfile


class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)
    users = models.ManyToManyField(
        UserProfile,
        through="UserProject",
        related_name="assigned_projects"
    )

    class Meta:
        db_table = "optio_projects"

    def __str__(self):
        return self.name


class UserProject(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    class Meta:
        db_table = "optio_user_projects"
