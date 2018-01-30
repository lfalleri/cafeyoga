from django.conf.urls import patterns, url, include
from django.contrib import admin

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView, FullAccountView, SettingsView, LandingPageView
from yoga.views import CalendarView, LessonView, ReservationView
from cafeyoga.views import IndexView, LandingPageView
from restaurant.views import MenuView
#from authentication import urls as authentication_urls


router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
#router.register(r'yoga', ReservationViewSet)
#router.register(r'calendar', CalendarView)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
#accounts_router.register(r'posts', AccountReservationViewSet)
admin.autodiscover()

urlpatterns = patterns(
    '',

    # ... URLs

    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/v1/auth/account/$', FullAccountView.as_view(), name='account'),
    #url(r'^api/v1/auth/settings/$', SettingsView.as_view(), name='account'),
    url(r'^api/v1/calendar/$', CalendarView.as_view(), name='calendar'),
    url(r'^api/v1/yoga/lessons/$', LessonView.as_view(), name='lesson'),
    url(r'^api/v1/yoga/reservation/$', ReservationView.as_view(), name='yoga'),
    url(r'^api/v1/restaurant/menu/$', MenuView.as_view(), name='menu'),
    #url(r'^$', include(authentication_urls.urls), name='general'),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^admin/$', include(admin.site.urls)),
    url(r'^admin/([-]?[0-9]*)/$', include(admin.site.urls)),

    url('^.*$', IndexView.as_view(), name='index'),
    #url('^.*$', LandingPageView.as_view(), name='general'),
)
