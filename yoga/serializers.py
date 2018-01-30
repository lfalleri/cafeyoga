from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

from authentication.serializers import AccountSerializer
from .models import Lesson, Reservation


class LessonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lesson
        fields = ('id', 'type', 'intensity', 'animator', 'date',
                  'duration', 'nb_places', 'price')

        def create(self, validated_data):
            return Lesson.objects.create(**validated_data)

        def update(self, instance, validated_data):
            instance.date = validated_data.get('date', instance.date)
            instance.save()
            return instance

class ReservationSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True, required=False)
    lesson = LessonSerializer(read_only=True, required=False)

    class Meta:
        model = Reservation

        fields = ('id', 'account', 'lesson', 'created', 'updated')
        read_only_fields = ('id')

        def create(self, validated_data):
            print("Reservation.Meta.create() ")
            return Reservation.objects.create(**validated_data)

        def update(self, instance, validated_data):
            print("Reservation.Meta.update() ")
            instance.date = validated_data.get('date', instance.date)

            instance.save()

            return instance