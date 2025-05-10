from django.urls import path
from .views import (
    ProjectListView,
    ProjectDetailView,
    CreateProjectAPIView,
    AssignProjectAPIView
)

urlpatterns = [
    path("list/", ProjectListView.as_view(), name="project-list"),
    path("detail/<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    path("create/", CreateProjectAPIView.as_view(), name="create-project"),
    path(
        "<int:project_id>/user/<int:user_id>/",
        AssignProjectAPIView.as_view(),
        name="assign-project-member"
    ),
]
