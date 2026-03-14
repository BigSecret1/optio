from rest_framework import serializers
from optio.users.models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'date_joined',
            'is_active',
            'role'
        ]

        read_only_fields = [
            'id',
            'date_joined',
            'is_active'
        ]

    def get_role(self, obj):
        membership = self.context.get("membership")
        return membership.role if membership else None
