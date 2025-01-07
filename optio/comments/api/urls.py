from django.urls import path

from comments.api.views import CreateView

urlpatterns = [
    path('comments/', CreateView.as_view(), name = "add-comment"),
]
