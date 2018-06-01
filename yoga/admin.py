from django.contrib import admin
from .models import Lesson, Professeur, UploadedImage, Reservation, Transaction, Formule, CodeReduction

admin.site.register(Lesson)
admin.site.register(Reservation)
admin.site.register(Professeur)
admin.site.register(UploadedImage)

admin.site.register(Transaction)
admin.site.register(Formule)
admin.site.register(CodeReduction)
