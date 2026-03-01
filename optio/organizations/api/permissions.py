from rest_framework.permissions import BasePermission
from optio.organizations.models import Membership


class IsOrganizationMember(BasePermission):
    required_role = None

    def has_permission(self, request, view):
        organization_id = view.kwargs.get("organization_id")

        if not organization_id:
            return False

        membership = Membership.objects.filter(
            user=request.user,
            organization_id=organization_id
        ).first()

        if not membership:
            return False

        if self.required_role and membership.role != self.required_role:
            return False

        return True


class IsOrganizationAdmin(IsOrganizationMember):
    required_role = Membership.Role.ADMIN
