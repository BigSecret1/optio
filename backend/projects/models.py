from django.db import models

class Project(models.Model):
    id = models.AutoField(primary_key=True)  # Maps to the serial type in PostgreSQL
    name = models.CharField(max_length=100)
    project_updated = models.DateTimeField(auto_now=True)  # Maps to CURRENT_TIMESTAMP with timezone
    stars = models.IntegerField(default=0)
    project_description = models.TextField(blank=True, null=True)
    is_starred = models.BooleanField(default=False)

    class Meta:
        db_table = "projects"
        indexes = [
            models.Index(fields=["id"], name="projects_pkey"),  # Matches the primary key index
        ]
        constraints = [
            # Foreign key from tasks already defined in the Task model
        ]
        managed = False  # Since the table already exists

    def __str__(self):
        return self.name
