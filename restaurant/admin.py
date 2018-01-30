from django.contrib import admin
from .models import Categorie, Carte, Plat, Specificite, Brunch, BrunchItem

admin.site.register(Carte)
admin.site.register(Categorie)
admin.site.register(Specificite)
admin.site.register(Plat)
admin.site.register(Brunch)
admin.site.register(BrunchItem)
