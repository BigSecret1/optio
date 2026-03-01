from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from optio.projects.serializers import ProjectSerializer
from optio.users.serializers import UserSerializer
from optio.projects.models import Project, UserProject
from optio.users.models import UserProfile
from optio.organizations.models import Membership


class ProjectAPIAction:
    def __init__(self, organization):
        self.organization = organization

    def _get_project(self, project_id):
        """
        Internal helper to fetch project scoped to organization.
        """
        return get_object_or_404(
            Project,
            pk=project_id,
            organization=self.organization
        )

    def get_project(self, project_id):
        project = self._get_project(project_id)
        return ProjectSerializer(project).data

    def update_project(self, project_id, data):
        project = self._get_project(project_id)

        serializer = ProjectSerializer(
            project,
            data=data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return serializer.data


class ProjectUserAPIAction:
    def __init__(self, organization):
        self.organization = organization

    def _get_project(self, project_id):
        """
        Internal helper to fetch project scoped to organization.
        """
        return get_object_or_404(
            Project,
            pk=project_id,
            organization=self.organization
        )

    def get_project_users(self, project_id):
        project = get_object_or_404(
            Project,
            pk=project_id,
            organization=self.organization
        )
        print("project", project)

        queryset = UserProfile.objects.filter(
            userproject__project=project
        ).distinct()

        return UserSerializer(queryset, many=True).data

    @transaction.atomic
    def assign_users(self, project_id, user_ids):

        if not user_ids:
            raise ValidationError("user_ids list is required")

        project = self._get_project(project_id)

        # Validate users belong to same organization
        valid_user_ids = set(
            Membership.objects.filter(
                organization=self.organization,
                user_id__in=user_ids
            ).values_list("user_id", flat=True)
        )

        invalid_user_ids = set(user_ids) - valid_user_ids

        if invalid_user_ids:
            raise ValidationError(
                f"Users {list(invalid_user_ids)} do not belong to this organization"
            )

        # Avoid duplicate assignments
        existing_assignments = set(
            UserProject.objects.filter(
                project=project,
                user_id__in=valid_user_ids
            ).values_list("user_id", flat=True)
        )

        new_user_ids = valid_user_ids - existing_assignments

        # Bulk create new assignments
        UserProject.objects.bulk_create([
            UserProject(user_id=user_id, project=project)
            for user_id in new_user_ids
        ])

        return {
            "assigned_users": list(new_user_ids),
            "already_assigned": list(existing_assignments),
        }
