"""Base serializer for Settings singletons.

Runs the model's own field + `clean()` validation so per-field rules (positive
windows, renotify >= 1, etc.) surface as DRF field errors, exactly as the Django
admin form would — no duplicated validation. `validate_unique` is skipped since
the row is a fixed pk=1 singleton.
"""

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers


class SingletonSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        model = self.Meta.model
        writable = [name for name, field in self.fields.items() if not field.read_only]
        merged = {name: getattr(self.instance, name) for name in writable}
        merged.update(attrs)
        candidate = model(**merged)
        candidate.pk = 1
        try:
            candidate.clean_fields(exclude=["id"])
            candidate.clean()
        except DjangoValidationError as exc:
            raise serializers.ValidationError(
                exc.message_dict if hasattr(exc, "message_dict") else exc.messages
            )
        return attrs
