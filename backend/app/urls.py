from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('tasks/', include('tasks.urls')),
    path('performance-metrics/', include('performance_metrics.urls')),
    path('user/',include('profiles.urls')),
]
