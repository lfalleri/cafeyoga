# -*- coding: utf-8 -*-
from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from authentication.serializers import AccountSerializer
from .models import Plat, Categorie, Specificite, Brunch, BrunchItem, Carte
import sys

reload(sys)
sys.setdefaultencoding('utf8')


class CategorieSerializer(serializers.ModelSerializer):

    class Meta:
        model = Categorie
        fields = ('id', 'titre')


class SpecificiteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Specificite
        fields = ('id', 'titre')


class PlatSerializer(serializers.ModelSerializer):
    categorie = CategorieSerializer(read_only=True, required=False)
    specificite = SpecificiteSerializer(read_only=True, required=False)

    class Meta:
        model = Plat
        fields = ('id', 'categorie', 'specificite', 'denomination', 'prix', 'ingredients')


class BrunchItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrunchItem
        fields = ('id', 'plat', 'est_en_option', 'prix_option')


class BrunchSerializer(serializers.ModelSerializer):
    items = BrunchItemSerializer(many=True, read_only=True)

    class Meta:
        model = Brunch
        fields = ('id', 'didascalie', 'titre', 'items', 'prix')


class CarteSerializer(serializers.ModelSerializer):

    brunchs = BrunchSerializer(many=True, read_only=True)
    plats = PlatSerializer(many=True, read_only=True)

    class Meta:
        model = Carte
        fields = ('id', 'nom', 'brunchs', 'plats')


class ReservationSerializer(serializers.ModelSerializer):
    pass

