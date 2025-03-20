from django.db import models


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    project_updated = models.DateTimeField(auto_now=True)
    stars = models.IntegerField(default=0)
    project_description = models.TextField(blank=True, null=True)
    is_starred = models.BooleanField(default=False)

    class Meta:
        db_table = "projects"
        constraints = []
        managed = True

    def __str__(self):
        return self.name
