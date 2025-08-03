from django.urls import path
from optio.search.api import SearchTaskAPIView, SearchProjectAPIView, SearchUserAPIView

urlpatterns = [
    path("task/", SearchTaskAPIView.as_view(), name="search-task"),
    path("project/", SearchProjectAPIView.as_view(), name="search-project"),
    path("user/", SearchUserAPIView.as_view(), name="search-user")
]
