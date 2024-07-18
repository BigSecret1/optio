from django.contrib import admin
from django.urls import path, include
#from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('admin/', admin.site.urls),
    path('tasks/', include('tasks.urls')),
    path('performance-metrics/', include('performance_metrics.urls')),
    path('user/',include('profiles.urls')),
    path('projects/', include('projects.urls')),
]
