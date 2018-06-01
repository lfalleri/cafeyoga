from django.conf.urls import patterns, url, include
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from rest_framework_nested import routers

from authentication.views import AccountViewSet, \
                                 AccountView, \
                                 LoginView, \
                                 LogoutView, \
                                 FullAccountView, \
                                 SettingsView, \
                                 LandingPageView

from yoga.views import CalendarView, \
                       LessonView, \
                       ReservationView,\
                       PendingReservationView,\
                       ProfesseursView,\
                       TransactionView,\
                       FormuleView,\
                       CodeReductionView


from cafeyoga.views import IndexView,\
                           LandingPageView

from restaurant.views import CarteView, \
                             RestaurantConfigView,\
                             RestaurantReservationView

from boutique.views import CreateurView, \
                            ExpositionView

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)

admin.autodiscover()

urlpatterns = patterns(
    '',
    # Account Views
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/v1/auth/fullaccount/$', FullAccountView.as_view(), name='account'),
    url(r'^api/v1/auth/accounts/$', AccountView.as_view(), name='accounts'),
    url(r'^api/v1/auth/update-profile/$', AccountView.as_view(), name='update'),

    # Yoga Views
    url(r'^api/v1/calendar/$', CalendarView.as_view(), name='calendar'),
    url(r'^api/v1/yoga/lessons/$', LessonView.as_view(), name='lesson'),
    url(r'^api/v1/yoga/reservation/$', ReservationView.as_view(), name='yoga_reservation'),
    url(r'^api/v1/yoga/pendingreservation/$', PendingReservationView.as_view(), name='yoga_pending_reservation'),
    url(r'^api/v1/yoga/animators/$', ProfesseursView.as_view(), name='yoga_animators'),
    url(r'^api/v1/yoga/formule/$', FormuleView.as_view(), name='formule'),
    url(r'^api/v1/yoga/transaction/$', TransactionView.as_view(), name='transaction'),
    url(r'^api/v1/yoga/code-reduction/$', CodeReductionView.as_view(), name='code-reduction'),

    # Restaurant Views
    url(r'^api/v1/restaurant/menu/$', CarteView.as_view(), name='carte'),
    url(r'^api/v1/restaurant/config/$', RestaurantConfigView.as_view(), name='carte'),
    url(r'^api/v1/restaurant/reservation/$', RestaurantReservationView.as_view(), name='reservation'),

    # Boutique Views
    url(r'^api/v1/boutique/createurs/$', CreateurView.as_view(), name='createurs'),
    url(r'^api/v1/boutique/expos/$', ExpositionView.as_view(), name='expos'),

    # Admin Views
    url(r'^admin/', include(admin.site.urls)),
    url(r'^admin/$', include(admin.site.urls)),
    url(r'^admin/([-]?[0-9]*)/$', include(admin.site.urls)),

    # Index Views
    url('^.*$', IndexView.as_view(), name='index'),
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
