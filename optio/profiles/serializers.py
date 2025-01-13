from rest_framework import serializers
from optio.profiles.models import CustomUser, Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'is_active']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['user', 'bio', 'location', 'birth_date']
