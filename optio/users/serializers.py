from rest_framework import serializers
from optio.users.models import UserProfile
from django.contrib.auth.models import Group


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'date_joined',
            'is_active',
            'groups'
        ]
