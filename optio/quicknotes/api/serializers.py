from rest_framework import serializers

from optio.quicknotes.models import QuickNote


class QuickNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickNote
        fields = ["id", "note"]

        extra_kwargs = {
            "note": {
                "required": True,
                "allow_null": False,
                "error_messages": {
                    "required": "The note field is required.",
                    "null": "Note cannot be null."
                }
            }
        }

    def validate(self, attrs):
        if self.partial:
            if "note" not in self.initial_data:
                raise serializers.ValidationError(
                    {"note": "This property is missing in request body"})
        return attrs
