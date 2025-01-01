from django.urls import path
from tasks.views import (
    CreateTask,
    GetTaskById,
    UpdateTask,
    DeleteTask,
    GetTasks,
    Searcher,
    CreateSubTask,
    GetSubTasks
)


urlpatterns = [
    path('create-task/', CreateTask.as_view(), name='create-task'),
    path('get-task-by-id/<int:task_id>/', GetTaskById.as_view(), name='get-task-by-id'),
    path('get-tasks/', GetTasks.as_view(), name='get-tasks'),
    path('update-task/<int:task_id>/', UpdateTask.as_view(), name='update-task'),
    path('delete-task/<int:task_id>/', DeleteTask.as_view(), name='delete-task'),
    path('search/', Searcher.as_view(), name='search-tasks'),
    path('create-subtask/', CreateSubTask.as_view(), name='create-subtask'),
    path('<int:parent_task_id>/get-subtasks/', GetSubTasks.as_view(), name="get-subtasks")
]
