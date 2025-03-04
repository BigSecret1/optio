from django.urls import path
from optio.search.api import SearchTaskAPIView, SearchProjectAPIView

urlpatterns = [
    path("task-title/", SearchTaskAPIView.as_view(), name="search-task"),
    path("project-name/", SearchProjectAPIView.as_view(), name="search-project")
]
