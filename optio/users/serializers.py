from rest_framework import serializers
from optio.users.models import UserProfile

ALLOWED_GROUPS = ["Admin", "Alpha", "Beta", "Gamma"]


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

    def validate_groups(self, value):
        invalid = [group for group in value if group not in ALLOWED_GROUPS]
        if invalid:
            raise serializers.ValidationError(
                f"Invalid group(s): {', '.join(invalid)}. Allowed groups are: {', '.join(ALLOWED_GROUPS)}"
            )
        return value
