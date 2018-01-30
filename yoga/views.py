import json
from rest_framework import permissions, views, viewsets
from rest_framework.response import Response
from django.shortcuts import render
from .models import Lesson, Reservation, ReservationManager
from authentication.models import Account
from .serializers import LessonSerializer, ReservationSerializer
from .permissions import IsAuthorOfReservation
from django.contrib.admin.views.decorators import staff_member_required


class CalendarView(views.APIView):
    serializer_class = LessonSerializer

    def post(self, request, format=None):

        queryset = Lesson.objects.all()


class LessonView(views.APIView):
    serializer_class = LessonSerializer

    def get(self, request, format=None):
        queryset = Lesson.objects.all()
        serialized = LessonSerializer(queryset, many=True)
        return Response(serialized.data)


class ReservationView(views.APIView):
    serializer_class = ReservationSerializer

    def post(self, request, format=None):
        data = json.loads(request.body)
        account_id = data['account']['id']
        lesson_id = data['lesson']['id']

        print("ReservationView() account_id = %d / lesson_id = %d " % (account_id, lesson_id))
        # Get objects account and event
        lesson = Lesson.objects.get(id=lesson_id)
        account = Account.objects.get(id=account_id)

        reservation = Reservation.objects.create_reservation(lesson, account)

        if account is not None:
            if account.is_active:
                if account.credits < lesson.price:
                    return Response({
                        'status': 'Unauthorized',
                        'message': 'Not enough credits for this account'
                    }, status=status.HTTP_401_UNAUTHORIZED)

                account.credits = account.credits - lesson.price
                account.save()
                serialized = ReservationSerializer(reservation)
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
    review_template = '/static/templates/yoga/reservations.html'

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