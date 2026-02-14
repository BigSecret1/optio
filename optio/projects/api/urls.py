from django.urls import path
from optio.projects.api.views import ProjectUsersAPIView, ProjectAPIView

urlpatterns = [
    path(
        "<int:project_id>/users/",
        ProjectUsersAPIView.as_view(),
        name="add-project-users"
    ),
    path('<int:project_id>/', ProjectAPIView.as_view()),
]
