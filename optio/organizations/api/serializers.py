from rest_framework import serializers
from optio.organizations.models import Organization
from optio.organizations.models import Membership


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'created_at']


class MembershipSerializer(serializers.ModelSerializer):
    organization_id = serializers.IntegerField(source='organization.id')
    organization_name = serializers.CharField(source='organization.name')

    class Meta:
        model = Membership
        fields = ['organization_id', 'organization_name', 'role']


class OrganizationUserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id')
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    is_active = serializers.BooleanField(source='user.is_active')
    date_joined = serializers.DateTimeField(source='user.date_joined')

    class Meta:
        model = Membership
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'role',
            'date_joined',
            'is_active'
        ]
