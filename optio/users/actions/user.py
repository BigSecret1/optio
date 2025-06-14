import logging

from rest_framework.exceptions import ValidationError, NotFound

from django.contrib.auth.models import Group

from optio.users.models import UserProfile, UserGroup
from optio.users.serializers import UserSerializer

logger = logging.getLogger(__name__)


class User:
    def fetch_all(self):
        try:
            users = UserProfile.objects.all()
            serializer = UserSerializer(instance=users, many=True)
            return serializer.data
        except Exception as e:
            logger.error("Exception occurred while fetching all users: %s", str(e))
            raise

    def fetch(self, id):
        try:
            user = UserProfile.objects.get(id=id)
            serializer = UserSerializer(user)
            return serializer.data
        except Exception:
            raise Exception("Failure in fetching user")

    def update(self, id, data):
        try:
            user = UserProfile.objects.get(id=id)

            groups = data.get("groups", [])

            UserGroup.objects.filter(user=user).delete()

            for group_name in groups:
                group = Group.objects.get(name=group_name)
                UserGroup.objects.create(user=user, group=group)

            serializer = UserSerializer(user, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            else:
                raise ValidationError(serializer.errors)

        except UserProfile.DoesNotExist:
            raise ValidationError("User does not exist.")
        except Group.DoesNotExist as e:
            logger.error(
                "Invalid group passed despite serializer validation: %s", str(e)
            )
            raise ValidationError(f"Group '{group_name}' does not exist.")
        except Exception as e:
            logger.error("Unexpected error while updating user: %s", str(e))
            raise Exception("Failure in updating user.")

    def delete(self, user_id):
        try:
            user = UserProfile.objects.get(id=user_id)
            user.delete()
            return {"status": "success", "message": "User deleted successfully"}
        except UserProfile.DoesNotExist:
            raise NotFound("User does not exist")
        except Exception as e:
            logger.error("Error deleting user: %s", str(e))
            raise Exception("An unexpected error occurred")
