from django.urls import path
from .views import (
    CreateTask,
    GetTaskById,
    UpdateTask,
    DeleteTask,
)

urlpatterns = [
    path('create-task/', CreateTask.as_view(), name='create-task'),
    path('get-task-by-id/<int:task_id>/', GetTaskById.as_view(), name='get-task-by-id'),
    path('update-task/<int:task_id>/', UpdateTask.as_view(), name='update-task'),
    path('delete-task/<int:task_id>/', DeleteTask.as_view(), name='delete-task'),
]
