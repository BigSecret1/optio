from django.urls import path
from optio.search.api import SearchTaskAPIView

urlpatterns = [
    path('task-title/', SearchTaskAPIView.as_view(), name='create-task')
]
