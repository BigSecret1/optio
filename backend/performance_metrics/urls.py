from django.urls import path
from .views import total_completed_tasks 
urlpatterns = [
    path('total-completed-tasks/', total_completed_tasks, name='total-completed-tasks'),
]

