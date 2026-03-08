from rest_framework import serializers

class UserSearchSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()


class TaskSearchSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    status = serializers.CharField()


class ProjectSearchSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
