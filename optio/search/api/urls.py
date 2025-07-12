from django.urls import path
from optio.search.api import SearchTaskAPIView, SearchProjectAPIView

urlpatterns = [
    path("task/", SearchTaskAPIView.as_view(), name="search-task"),
    path("project/", SearchProjectAPIView.as_view(), name="search-project")
]
