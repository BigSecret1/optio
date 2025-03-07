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

    def fetch_note(self, note_id: int):
        try:
            note = QuickNote.objects.filter(id=note_id)
            serializer = QuickNoteSerializer(instance=note, many=True)
            logging.info(note)
            return serializer.data
        except Exception as e:
            logging.error("some error occured while fetching the note %s", str(e))
            raise

    def update_quicknote(self, note_id: int, data: QuickNote):
        try:
            serializer = QuickNoteSerializer(data=data, partial=True)
            if serializer.is_valid():
                validated_data = serializer.validated_data
                new_note: str = validated_data.get("note")

                with transaction.atomic():
                    QuickNote.objects.filter(id=note_id).update(note=new_note)
                return({"success": "Note was updated successfully"})
            else:
                logging.error(
                    "Request data validation failed with serializer exception : %s",
                    str(serializer.errors))
                raise ValidationError(serializer.errors)
        except ValidationError:
            raise
        except Exception as e:
            raise
