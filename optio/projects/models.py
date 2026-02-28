from django.db import models
from optio.users.models import UserProfile
from optio.organizations.models import Organization


class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)
    users = models.ManyToManyField(
        UserProfile,
        through="UserProject",
        related_name="assigned_projects"
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="projects",
        db_column="organization_id"
    )

    class Meta:
        db_table = "optio_projects"

    def __str__(self):
        return self.name


# This model is redundant and has to be removed in the future
class UserProject(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    class Meta:
        db_table = "optio_user_projects"
        unique_together = ("user", "project")
