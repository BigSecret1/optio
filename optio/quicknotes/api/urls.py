from django.urls import path
from optio.quicknotes.api.views import AddNoteAPIView, UpdateNoteAPIView, \
    ListNoteAPIView

urlpatterns = [
    path("", AddNoteAPIView.as_view(), name="add-quicknote"),
    path("<int:note_id>/", UpdateNoteAPIView.as_view(), name="update-quicknote"),
    path("list/<int:note_id>/", ListNoteAPIView.as_view(), name="list-quicknote")
]
