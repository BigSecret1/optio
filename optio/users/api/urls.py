from django.urls import path
from optio.users.api.views import UserAPIView, LoginAPIView, LogoutAPIView

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("users/", UserAPIView.as_view()),
    path("users/<int:user_id>/", UserAPIView.as_view()),
]
