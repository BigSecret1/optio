from rest_framework.exceptions import ValidationError

from django.db import transaction

from optio.quicknotes.models import QuickNote
from optio.quicknotes.api.serializers import QuickNoteSerializer

import logging


class QuickNoteAPIAction():
    def add_quicknote(self, data: QuickNote):
        try:
            serializer = QuickNoteSerializer(data=data)
            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()
                return {"success": "Successfully saved note to db"}
            else:
                logging.error("Validation exception", str(serializer.errors))
                raise ValidationError(serializer.errors)
        except Exception:
            raise
