from django.urls import path
from optio.comments.api.views import CommentAPIView

urlpatterns = [
    path('comments/<int:comment_id>/', CommentAPIView.as_view()),
    path('tasks/<int:task_id>/comments/', CommentAPIView.as_view()),

]
