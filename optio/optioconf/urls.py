from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/security/', include('optio.users.api.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/orgs/<int:organization_id>/tasks/', include('optio.tasks.api.urls')),
    path('api/orgs/<int:organization_id>/', include('optio.comments.api.urls')),
    path('api/orgs/<int:organization_id>/', include('optio.users.api.urls')),
    path(
        'api/orgs/<int:organization_id>/projects/',
        include('optio.projects.api.urls')
    ),
    path('api/orgs/<int:organization_id>/search/', include('optio.search.api.urls')),
    path('quicknotes/', include('quicknotes.api.urls'))
]
