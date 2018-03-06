# -*- coding: utf-8 -*-
import json
from rest_framework import permissions, views, status, viewsets, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import render
from .models import Lesson, Reservation, ReservationManager, Professeur
from authentication.models import Account
from .serializers import LessonSerializer, ReservationSerializer, ProfesseurSerializer
from .permissions import IsAuthorOfReservation
from django.contrib.admin.views.decorators import staff_member_required
import time
from datetime import datetime
import pytz

class CalendarView(views.APIView):
    serializer_class = LessonSerializer

    def post(self, request, format=None):
        queryset = Lesson.objects.all()


class LessonView(views.APIView):
    serializer_class = LessonSerializer

    def get(self, request, format=None):
        if 'lesson_id' not in request.query_params.keys():
            queryset = Lesson.objects.all()
        else:
            lesson_id = request.query_params['lesson_id']
            lesson = Lesson.objects.get(id=lesson_id)
            if not lesson:
                return Response(status=status.HTTP_404_NOT_FOUND)
            queryset = [lesson]

        fmt = '%Y-%m-%d %H:%M:%S'
        now = datetime.utcnow().replace(tzinfo=pytz.utc)
        dnow = datetime.strptime(now.strftime(fmt), fmt)

        for i,_ in enumerate(queryset):
            pending_reservations = Reservation.objects.filter(lesson=queryset[i], confirmed=False)
            #print("Pending reservation for lesson : %s  ----> %s"%(queryset[i], pending_reservations))
            if pending_reservations:
                for pending_reservation in pending_reservations:
                    d2 = datetime.strptime(pending_reservation.created.strftime(fmt), fmt)
                    diff = (dnow - d2)
                    diff_min, diff_sec = divmod(diff.days * 86400 + diff.seconds, 60)
                    if diff_min >= 15:
                        pending_reservation.delete()
                    else:
                        queryset[i].nb_places -= pending_reservation.nb_personnes

        #print("New queryset : %s  " % (queryset))
        new_queryset = queryset[:]
        serialized = LessonSerializer(new_queryset, many=True)
        return Response(serialized.data)


class ReservationView(views.APIView):
    serializer_class = ReservationSerializer

    def post(self, request, format=None):
        data = json.loads(request.body)
        print("ReservationView->post :  %s" % data)
        account_id = data['account']['id']
        lesson_id = data['lesson']['id']
        print("2 ReservationView->post : account :  %d" % account_id)
        print("2 ReservationView->post : lesson : %d" % lesson_id)
        # Get objects account and event
        lesson = Lesson.objects.get(id=lesson_id)
        account = Account.objects.get(id=account_id)
        print("2 ReservationView->post : account :  %s" % account)
        print("2 ReservationView->post : lesson : %s" % lesson)

        credit = 0
        debit = 0

        if 'present' in data.keys():
            reservation = Reservation.objects.filter(account=account, lesson=lesson, confirmed=True)
            reservation = reservation[0]
            reservation.checked_present = data['present']
            reservation.save()
            serialized = ReservationSerializer(reservation)
            return Response(serialized.data)

        nb_persons = data['nb_persons']
        print("2/ReservationView->post %d" %nb_persons)
        if lesson.nb_places < nb_persons:
            return Response({
                'status': 'Unauthorized',
                'message': 'Nombre de places insuffisant pour réserver ce cours'
            }, status=status.HTTP_401_UNAUTHORIZED)

        if 'credit' in data.keys() and 'debit' in data.keys():
            print("ReservationView->post :  %s"%data)
            # Live reservation
            credit = int(data['credit'])
            debit = int(data['debit'])

        if account is not None:
            if account.is_active:
                if (account.credits + credit) < (lesson.price * nb_persons):
                    return Response({
                        'status': 'Unauthorized',
                        'message': 'Not enough credits for this account'
                    }, status=status.HTTP_401_UNAUTHORIZED)

                reservation = Reservation.objects.create_reservation(lesson, account, nb_persons, True)
                print("ReservationView->post : reservation= %s"% reservation)
                serialized = ReservationSerializer(reservation)
                print("2/= credit ")
                # Update account and lesson
                account.credits += credit - (lesson.price * nb_persons)
                print("3/= ")
                account.save()
                print("ReservationView->post : new account= %s" % account)
                lesson.nb_places -= nb_persons
                lesson.save()
                print("ReservationView->post : new lesson= %s" % lesson)
                print("ReservationView->post : serialized.data= %s" % serialized.data)
                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, format=None):
        account_id = request.query_params['account_id']
        account = Account.objects.get(id=account_id)
        lesson_id = request.query_params['lesson_id']
        lesson = Lesson.objects.get(id=lesson_id)

        reservation = Reservation.objects.filter(account=account, lesson=lesson, confirmed=True)
        if not reservation:
            return Response(status=status.HTTP_404_NOT_FOUND)
        reservation = reservation[0]

        #Update account and lesson
        account.credits += lesson.price * reservation.nb_personnes
        account.save()
        lesson.nb_places += reservation.nb_personnes
        lesson.save()

        reservation.delete()
        return Response(status=status.HTTP_200_OK)

    def get(self, request, format=None):
        account = None
        lesson = None
        reservations = []

        if 'account_id' in request.query_params.keys():
            account_id = request.query_params['account_id']
            account = Account.objects.get(id=account_id)
            if not account:
               return Response(status=status.HTTP_404_NOT_FOUND)

        if 'lesson_id' in request.query_params.keys():
            lesson_id = request.query_params['lesson_id']
            lesson = Lesson.objects.get(id=lesson_id)
            if not lesson:
                return Response(status=status.HTTP_404_NOT_FOUND)

        if lesson and account:
            reservations = Reservation.objects.filter(account=account, lesson=lesson, confirmed=True)
            if not reservations:
                return Response(status=status.HTTP_404_NOT_FOUND)
        elif lesson and not account:
            reservations = Reservation.objects.filter(lesson=lesson, confirmed=True)
        elif not lesson and account:
            reservations = Reservation.objects.filter(account=account, confirmed=True)

        serialized = ReservationSerializer(reservations, many=True)
        return Response(serialized.data)


class PendingReservationView(views.APIView):

    def post(self, request, format=None):
        data = json.loads(request.body)
        print("PendingReservationView->post :  %s" % data)
        lesson_id = data['lesson']['id']
        account_id = data['account']['id']
        nb_places = data['nb_pending_reservations']
        print("2 PendingReservationView->post : lesson : %d / nb_places : %d" %(lesson_id, nb_places))

        lesson = Lesson.objects.get(id=lesson_id)
        if not lesson:
            return Response({
                'status': 'Unauthorized',
                'message': "Le cours n'a pu être trouvé"
            }, status=status.HTTP_404_NOT_FOUND)

        account = Account.objects.get(id=account_id)
        if not account:
            return Response({
                'status': 'Unauthorized',
                'message': "Utilisateur non trouvé"
            }, status=status.HTTP_404_NOT_FOUND)

        print("3/ PendingReservationView->post ")

        if nb_places > lesson.nb_places:
            return Response({
                'status': 'Unauthorized',
                'message': "Plus assez de places restantes"
            }, status=status.HTTP_401_UNAUTHORIZED)

        print("4/ PendingReservationView->post ")
        pending_reservation = Reservation.objects.filter(lesson=lesson, account=account, confirmed=False)
        if not pending_reservation:
            print("Creating new PendingReservation")
            pending_reservation = Reservation.objects.create_reservation(lesson, account, nb_places, False)
            print("pending_reservation :%s"%pending_reservation)
        else:
            print("Existing pending_reservation :%s" % pending_reservation)
            pending_reservation = pending_reservation[0]
            pending_reservation.nb_personnes += nb_places
            if pending_reservation.nb_personnes > lesson.nb_places:
                return Response({
                    'status': 'Unauthorized',
                    'message': "Plus assez de places restantes"
                }, status=status.HTTP_401_UNAUTHORIZED)
            print("5/ pending_reservation :%s" % pending_reservation)
            pending_reservation.save()
        print("6/ Existing pending_reservation :%s" % pending_reservation)
        serialized = ReservationSerializer(pending_reservation)
        return Response(serialized.data)

    def delete(self, request, format=None):
        print("PendingReservationView")
        print("PendingReservationView-> delete :%s" % request.query_params)
        lesson_id = request.query_params['lesson_id']
        lesson = Lesson.objects.get(id=lesson_id)
        print("PendingReservationView-> delete lesson:%s" % lesson)

        account_id = request.query_params['account_id']
        account = Account.objects.get(id=account_id)

        print("PendingReservationView-> delete account:%s" % account)
        nb_places = int(request.query_params['nb_pending_reservations'])
        print("PendingReservationView-> delete --> lesson :%s / nb_pending_reservations:%d" % (lesson, nb_places))
        pending_reservation = Reservation.objects.filter(lesson=lesson, account=account, confirmed=False)
        if not pending_reservation:
            return Response(status=status.HTTP_404_NOT_FOUND)

        pending_reservation = pending_reservation[0]
        pending_reservation.delete()
        return Response(status=status.HTTP_200_OK)

    def get(self, request, format=None):
        account = None
        lesson = None
        reservations = []

        if 'account_id' in request.query_params.keys():
            account_id = request.query_params['account_id']
            account = Account.objects.get(id=account_id)
            if not account:
               return Response(status=status.HTTP_404_NOT_FOUND)

        if 'lesson_id' in request.query_params.keys():
            lesson_id = request.query_params['lesson_id']
            lesson = Lesson.objects.get(id=lesson_id)
            if not lesson:
                return Response(status=status.HTTP_404_NOT_FOUND)

        print("PendingReservationView-> get --> lesson :%s / account:%s" % (lesson, account))

        if lesson and account:
            reservations = Reservation.objects.filter(account=account, lesson=lesson, confirmed=False)
            if not reservations:
                return Response(status=status.HTTP_404_NOT_FOUND)
        elif lesson and not account:
            reservations = Reservation.objects.filter(lesson=lesson, confirmed=False)
        elif not lesson and account:
            reservations = Reservation.objects.filter(account=account, confirmed=False)

        print("reservations->  :%s " % (reservations))
        serialized = ReservationSerializer(reservations, many=True)
        print("serialized->  :%s " % (serialized.data))
        return Response(serialized.data)


class ProfesseursView(views.APIView):
    def get(self, request, format=None):
        queryset = Professeur.objects.all()
        print("ProfesseursView -> get : queryset=%s"%queryset)
        serialized = ProfesseurSerializer(queryset, many=True)
        return Response(serialized.data)


@staff_member_required
def adminReservationsView():
    now = datetime.datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html)

from functools import update_wrapper
from django.contrib import admin
from django.conf.urls import url
from django.template import RequestContext
from django.shortcuts import render_to_response


class ReservationsAdmin(admin.ModelAdmin):
    review_template = '/static/templates/yoga/reservation.html'

    def get_urls(self):
        def wrap(view):
            def wrapper(*args, **kwargs):
                return self.admin_site.admin_view(view)(*args, **kwargs)
            wrapper.model_admin = self
            return update_wrapper(wrapper, view)

        urls = super(ReservationsAdmin, self).get_urls()

        my_urls = [
            url(r'yoga/reservations/$', wrap(self.review), name='reservations'),
        ]

        return my_urls + urls

    def review(self, request, id):
        entry = Reservation.objects.get(pk=id)

        return render_to_response(self.review_template, {}, context_instance=RequestContext(request))

admin.site.register(Reservation, ReservationsAdmin)