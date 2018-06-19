# -*- coding: utf-8 -*-
from rest_framework import views, status

from rest_framework.response import Response
from .models import Evenement
from .serializers import EvenementSerializer


class EvenementView(views.APIView):
    serializer_class = EvenementSerializer

    def get(self, request, format=None):
        print("GET Evenements")
        evenements = Evenement.objects.all()
        serialized_evenements = EvenementSerializer(evenements, many=True)
        print("Evenements : %s "%serialized_evenements.data)
        return Response(serialized_evenements.data)
