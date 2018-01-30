# -*- coding: utf-8 -*-
from django.db import models
from authentication.models import Account
import json
from collections import namedtuple

import sys
reload(sys)
sys.setdefaultencoding('utf8')

DEFAULT_CARTE_ID = 1


class Carte(models.Model):
    nom = models.CharField(max_length=60)
    def __str__(self):
        return self.nom

    def __unicode__(self):
        return self.nom

class Categorie(models.Model):
    titre = models.CharField(max_length=60)

    def __unicode__(self):
        return self.titre

    def __str__(self):
        return self.titre


class Specificite(models.Model):
    titre = models.CharField(max_length=60)

    def __unicode__(self):
        return self.titre

    def __str__(self):
        return self.titre


class Plat(models.Model):
    carte = models.ForeignKey(Carte, default=DEFAULT_CARTE_ID, related_name="plats")
    categorie = models.ForeignKey(Categorie, on_delete=models.CASCADE)
    specificite = models.ForeignKey(Specificite, on_delete=models.CASCADE)
    denomination = models.CharField(max_length=30)
    ingredients = models.CharField(max_length=512)
    prix = models.IntegerField()

    def __unicode__(self):
        return ' | '.join([str(self.categorie), str(self.specificite), self.denomination, str(self.prix) + " €"])

    def __str__(self):
        return ' | '.join([str(self.categorie), str(self.specificite), self.denomination, str(self.prix) + " €"])


class Brunch(models.Model):
    carte = models.ForeignKey(Carte, default=DEFAULT_CARTE_ID, related_name="brunchs")
    didascalie = models.CharField(max_length=512, null=True)
    titre = models.CharField(max_length=80, default="")
    prix = models.IntegerField()

    def __unicode__(self):
        return ' | '.join([str(self.titre), str(self.prix) + " €"])

    def __str__(self):
        return ' | '.join([str(self.titre), str(self.prix) + " €"])


class BrunchItem(models.Model):
    brunch = models.ForeignKey(Brunch, related_name='items')
    plat = models.CharField(max_length=80)
    est_en_option = models.BooleanField(default=False)
    prix_option = models.IntegerField(blank=True, default=0)

    def __unicode__(self):
        return ' | '.join([str(self.plat), str("Option" if self.est_en_option else "Base"), str(self.prix_option) if self.est_en_option else ""])

    def __str__(self):
        return ' | '.join([str(self.plat), str("Option" if self.est_en_option else "Base"), str(self.prix_option) if self.est_en_option else ""])




class ReservationManager(models.Manager):
   pass


class Reservation(models.Model):
   pass




