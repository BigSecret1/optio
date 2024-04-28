from django.urls import path
from .views import create_task, get_task_by_id, update_task, delete_task

urlpatterns = [
    path('create/', create_task, name='create-task'),
    path('get/<int:task_id>', get_task_by_id, name='get-task'),
    path('update/<int:task_id>', update_task, name='update-task'),
     path('delete/<int:task_id>', delete_task, name='delete-task')
]

