from django.urls import path
from optio.users.views import (
    RegisterView,
    LoginView,
    LogoutView,
    ListUsers,
    EditUser, DeleteUser
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("list/", ListUsers.as_view(), name="list-users"),
    path("list/<int:id>/", ListUsers.as_view(), name="list-user-by-id"),
    path("edit/<int:id>/", EditUser.as_view(), name="edit-user"),
    path("delete/<int:id>/", DeleteUser.as_view(), name="delete-user"),
]
