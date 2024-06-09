from django.urls import path
from .views import (
total_completed_tasks_in_month,
total_to_do_tasks,
total_pending_tasks,
total_in_progress_tasks
) 

urlpatterns = [
    path('total-completed-tasks/', total_completed_tasks_in_month, name='total-completed-tasks'),
     path('total-to-do-tasks/', total_to_do_tasks, name='total-to-do-tasks'),
     path('total-in-progress-tasks/', total_in_progress_tasks, name='total-in-progress-tasks'),
     path('total-pending-tasks/', total_pending_tasks, name='total-pending-tasks'),
]

