from django.urls import path
from optio.tasks.api.views import TaskAPIView

urlpatterns = [
    path('', TaskAPIView.as_view()),
    path('<int:task_id>/', TaskAPIView.as_view()),

]
