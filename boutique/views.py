# -*- coding: utf-8 -*-
from rest_framework import views, status

from rest_framework.response import Response
from .models import Createur, Exposition, ExpositionPhoto
from .serializers import CreateurSerializer, ExpositionPhotoSerializer, ExpositionSerializer
import json
from datetime import datetime
import pytz


class CreateurView(views.APIView):
    serializer_class = CreateurSerializer

    def get(self, request, format=None):
        print("Createurs : get")
        createurs = Createur.objects.all()
        serialized_createur = CreateurSerializer(createurs, many=True)
        print("Createurs : %s "%serialized_createur.data)
        return Response(serialized_createur.data)


class ExpositionView(views.APIView):
    #serializer_class = ExpositionSerializer

    def get(self, request, format=None):
        print("Expos : get")
        expo = Exposition.objects.all()
        print("Expos : %s"% expo)
        serialized_expo = ExpositionSerializer(expo, many=True)
        print("Expos serialized : %s "%serialized_expo.data)
        return Response(serialized_expo.data)
