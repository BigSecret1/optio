from django.core.exceptions import ValidationError
from django.db import transaction, IntegrityError

from rest_framework.response import Response
from rest_framework import status

from .base import APIAction
from comments.models import Comment
from comments.api.serializers import CommentSerializer


class CommentAPIAction(APIAction):
    def add_comment(self, data : Comment):
        try:
            with transaction.atomic():
                serializer = CommentSerializer(data = data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    raise ValidationError(serializer.errors)
        except IntegrityError as e:
            raise IntegrityError(f"Adding comment operation failed , issue with db {e}")
        except Exception as e:
            raise Exception(f"{str(e)} exception occured while addming comment to db")

