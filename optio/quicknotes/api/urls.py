from django.urls import path
from optio.quicknotes.api.views import AddNoteAPIView

urlpatterns = [
    path("", AddNoteAPIView.as_view(), name="add-quicknote")
]
