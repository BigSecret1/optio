from django.urls import path
from .views import (
    TotalCompletedTasksInMonth,
    TotalToDoTasksInMonth,
    TotalInProgressTasksInMonth,
    TotalPendingTasksInMonth,
    ProjectTaskStatusInMonth
)

urlpatterns = [
    path('total-completed-tasks/', TotalCompletedTasksInMonth.as_view(), name='total-completed-tasks'),
    path('total-to-do-tasks/', TotalToDoTasksInMonth.as_view(), name='total-to-do-tasks'),
    path('total-in-progress-tasks/', TotalInProgressTasksInMonth.as_view(), name='total-in-progress-tasks'),
    path('total-pending-tasks/', TotalPendingTasksInMonth.as_view(), name='total-pending-tasks'),
    path('project-per-month-task-status/<int:project_id>/<str:task_status_type>/', ProjectTaskStatusInMonth.as_view(), name='project-per-month-task-status'),
]
