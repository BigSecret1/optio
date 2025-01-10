from django.urls import path

from comments.api.views import CreateView, EditView, DeleteView


urlpatterns = [
    path("", CreateView.as_view(), name = "add-comment"),
    path("<int:comment_id>/", EditView.as_view(), name = "update-comment"),
    path("remove/<int:comment_id>/", DeleteView.as_view(), name = "delete-comment")
]
