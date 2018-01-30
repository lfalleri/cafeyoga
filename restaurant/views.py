# -*- coding: utf-8 -*-
from rest_framework import views
from rest_framework.response import Response
from .models import Categorie, Plat, Brunch, BrunchItem, Carte
from .serializers import PlatSerializer, BrunchSerializer, CarteSerializer, ReservationSerializer


class MenuView(views.APIView):
    serializer_class = CarteSerializer

    def get(self, request, format=None):

        #plats = Plat.objects.all()
        #serialized_plats = PlatSerializer(plats, many=True)
        #print("Plats : %s\n\n" % str(serialized_plats.data))

        #brunchs = Brunch.objects.all()
        #serialized_brunchs = BrunchSerializer(brunchs, many=True)
        #print("Total response : %s" % str(serialized_plats.data + serialized_brunchs.data))

        carte = Carte.objects.get(id=1)
        serialized_carte = CarteSerializer(carte)
        print("serialized_carte : %s" % str(serialized_carte.data))

        return Response(serialized_carte.data)



# class MenuView(views.APIView):
#     serializer_class = BrunchSerializer
#
#     def get(self, request, format=None):
#
#         brunchs = Brunch.objects.all()
#
#         for brunch in brunchs:
#             brunch_items = brunch.brunchitems_set.objects.all()
#             print("brunch_items : %s" % str(brunch_items))
#             serialized_brunch = BrunchSerializer(brunch)
#             serialized_brunch_items = BrunchItemsSerializer(brunch_items, many=True)
#             serialized_brunch_data = serialized_brunch.data
#             serialized_brunch_data["items"] = serialized_brunch_items.data
#
#         print("queryset : %s" %str(brunchs))
#
#         serialized = BrunchSerializer(brunchs, many=True)
#
#         return Response(serialized.data)