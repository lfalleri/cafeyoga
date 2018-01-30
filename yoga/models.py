from django.db import models
from authentication.models import Account
import json
from collections import namedtuple


class Lesson(models.Model):

    TYPE_HATHA = 'Hatha'
    TYPE_ASHTANGA = 'Ashtanga'
    TYPE_VINYASA = 'Vinyasa'
    TYPE_BIKRAM = 'Bikram'
    TYPE_OF_LESSON = (
        (TYPE_HATHA, 'Hatha'),
        (TYPE_ASHTANGA, 'Ashtanga'),
        (TYPE_VINYASA, 'Vinyasa'),
        (TYPE_BIKRAM, 'Bikram'),
    )

    INTENSITY_DEBUTANT = 'Debutant'
    INTENSITY_BASIQUE = 'Basique'
    INTENSITY_INTERMEDIAIRE = 'Intermediaire'
    INTENSITY_INTENSIF = 'Intensif'
    INTENSITY_EXPERT = 'Expert'
    INTENSITY_OF_LESSON = (
        (INTENSITY_DEBUTANT, 'Debutant'),
        (INTENSITY_BASIQUE, 'Basique'),
        (INTENSITY_INTERMEDIAIRE, 'Intermediaire'),
        (INTENSITY_INTENSIF, 'Intensif'),
        (INTENSITY_EXPERT, 'Expert'),
    )

    type = models.CharField(max_length=30, choices=TYPE_OF_LESSON, default=TYPE_HATHA) # hatha, ashtanga ...
    intensity = models.CharField(max_length=30, choices=INTENSITY_OF_LESSON, default=INTENSITY_BASIQUE)
    animator = models.CharField(max_length=30)
    date = models.DateTimeField()
    duration = models.IntegerField() # in min
    nb_places = models.IntegerField(default=10)
    price = models.IntegerField(default=2) # En points : 1h = 2pts / 1h30 = 3pts


    def __unicode__(self):
        return ' '.join([self.type, self.intensity, self.animator, str(self.date)])

    def __str__(self):
        return ' '.join([self.type, self.intensity, self.animator, str(self.date)])


class ReservationManager(models.Manager):

    def create_reservation(self, lesson, account):
        print("ReservationManager.create_reservation(lesson=%s, account=%s)" % (lesson, account))
        reservation = Reservation(account=account, lesson=lesson)
        reservation.save(force_insert=True)
        return reservation


class Reservation(models.Model):

    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True, db_index=True)

    print("Reservation()")
    objects = ReservationManager()

    def __unicode__(self):
        return ' '.join([str(self.account), str(self.lesson)])

    def __str__(self):
        return str(self.account) + " - " + str(self.lesson)



