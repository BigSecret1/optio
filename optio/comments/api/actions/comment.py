from rest_framework.exceptions import ValidationError

from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist

import logging

from .base import APIAction
from optio.comments.models import Comment
from optio.comments.api.serializers import CommentSerializer


class CommentAPIAction(APIAction):
    def add_comment(self, data: Comment):
        try:
            serializer = CommentSerializer(data=data)
            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()
                return {"success": "Added comment successfully"}
            else:
                logging.error("%s exception occured, data validation failed",
                              serializer.errors)
                raise ValidationError(serializer.errors)
        except ValidationError:
            raise
        except Exception:
            raise

    def fetch_all_comments(self, task_id: int):
        try:
            comments = Comment.objects.filter(task=task_id)
            serializer = CommentSerializer(instance=comments, many=True)
            return serializer.data
            return comments
        except Exception as e:
            logging.error("some error occured while fetching the comments %s", str(e))
            raise

    def update_comment(self, comment_id: int, data: Comment):
        try:
            serializer = CommentSerializer(data=data, partial=True)
            if serializer.is_valid():
                validated_data = serializer.validated_data
                new_comment: str = validated_data.get("comment")

                with transaction.atomic():
                    Comment.objects.filter(id=comment_id).update(comment=new_comment)
            else:
                logging.error(
                    "Request data validation failed with serializer exception : %s",
                    str(serializer.errors))
                raise ValidationError(serializer.errors)
        except ValidationError:
            raise
        except Exception as e:
            raise

    def delete_comment(self, comment_id: int):
        try:
            comment = Comment.objects.get(id=comment_id)
            comment.delete()
        except ObjectDoesNotExist as e:
            logging.error("No comment exist with id error : %s", str(e))
            raise
        except Exception as e:
            raise
