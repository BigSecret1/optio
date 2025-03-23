from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)


    class Meta:
        db_table = "optio_projects"

    def __str__(self):
        return self.name
