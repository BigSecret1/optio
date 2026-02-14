from django.urls import path
from optio.projects.api.views import ProjectUsersAPIView

urlpatterns = [
    path(
        "<int:project_id>/users/",
        ProjectUsersAPIView.as_view(),
        name="add-project-users"
    )
]
