from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from optio.organizations.models import Membership


class BaseOrganizationAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def initial(self, request, *args, **kwargs):
        """
        Runs before every request method (GET, POST, etc).
        Good place to inject organization context.
        """
        super().initial(request, *args, **kwargs)

        org_id = kwargs.get("organization_id")

        if not org_id:
            raise PermissionDenied("Organization not provided")

        membership = Membership.objects.filter(
            user=request.user,
            organization_id=org_id
        ).first()

        if not membership:
            raise PermissionDenied("Not part of this organization")

        # Attach to request for later use
        request.organization = membership.organization
        request.membership = membership
