from django.db import models


#
class QuickNote(models.Model):
    id = models.AutoField(primary_key=True)
    note = models.TextField()

    class Meta:
        db_table = "optio_quicknotes"

