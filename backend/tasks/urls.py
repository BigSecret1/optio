from django.urls import path
from .views import create_task, get_task_by_id

urlpatterns = [
    path('create/', create_task, name='create-task'),
    path('get/<int:task_id>/', get_task_by_id, name='get-task')

]

