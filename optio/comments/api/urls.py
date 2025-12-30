from django.urls import path

from .views import CreateCommentAPIView, EditCommentAPIView, DeleteCommentAPIView, \
    ListCommentAPIView

urlpatterns = [
    path("", CreateCommentAPIView.as_view(), name="add-comment"),
    path("<int:comment_id>/", EditCommentAPIView.as_view(), name="update-comment"),
    path(
        "delete/<int:comment_id>/",
        DeleteCommentAPIView.as_view(),
        name="delete-comment"
    ),
    path("list/<int:task_id>/", ListCommentAPIView.as_view(), name="list-comments")
]
