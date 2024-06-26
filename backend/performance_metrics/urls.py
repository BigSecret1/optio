from django.urls import path
from .views import (
total_completed_tasks_in_month,
total_to_do_tasks_in_month,
total_pending_tasks_in_month,
total_in_progress_tasks_in_month,
total_completed_tasks_per_project_in_month
) 

urlpatterns = [
    path('total-completed-tasks/', total_completed_tasks_in_month, name='total-completed-tasks'),
     path('total-to-do-tasks/', total_to_do_tasks_in_month, name='total-to-do-tasks'),
     path('total-in-progress-tasks/', total_in_progress_tasks_in_month, name='total-in-progress-tasks'),
     path('total-pending-tasks/', total_pending_tasks_in_month, name='total-pending-tasks'),
     path('total-completed-tasks-per-project/<int:project_id>/<str:task_status_type>/', total_completed_tasks_per_project_in_month, name='total_completed_tasks_per_project_in_month'),
]

