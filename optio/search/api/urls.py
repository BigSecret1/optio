from django.urls import path
from optio.search.api import SearchTaskAPIView, SearchProjectAPIView, SearchUserAPIView

urlpatterns = [
    path("tasks/", SearchTaskAPIView.as_view(), name="search-task"),
    path("projects/", SearchProjectAPIView.as_view(), name="search-project"),
    path("users/", SearchUserAPIView.as_view(), name="search-user")
]
