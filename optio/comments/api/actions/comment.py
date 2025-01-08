from django.core.exceptions import ValidationError
from django.db import transaction, IntegrityError

import logging

from .base import APIAction
from comments.models import Comment
from comments.api.serializers import CommentSerializer


class CommentAPIAction(APIAction):
    def add_comment(self, data : Comment):
        try:
            serializer = CommentSerializer(data=data)
            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()
                return ({"success": "Added comment successfully"})
            else:
                raise ValidationError(serializer.errors)
        except IntegrityError as e:
            raise IntegrityError(f"Adding comment operation failed , issue with db {e}")
        except Exception as e:
            raise Exception(f"{str(e)} exception occured while addming comment to db")

    def update_comment(self, comment_id : int, data : Comment):
        try:
            serializer = CommentSerializer(data = data, partial = True)
            if serializer.is_valid():
                validated_data = serializer.validated_data
                new_comment : str = validated_data.get("comment")
                logging.info("New comment : %s", new_comment)

                with transaction.atomic():
                    Comment.objects.filter(id = comment_id).update(comment = new_comment)
            else:
                raise ValidationError(serializer.errors)
        except Exception as e:
            raise Exception(f"Couldn't update the comment something went wrong {e}")
