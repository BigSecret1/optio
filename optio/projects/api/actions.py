from optio.users.serializers import UserSerializer
from optio.users.models import UserProfile


class ProjectUserAPIAction:
    def get_project_users(self, project_id):
        queryset = UserProfile.objects.filter(userproject__project_id=project_id)
        users = UserSerializer(queryset, many=True).data
        return users
