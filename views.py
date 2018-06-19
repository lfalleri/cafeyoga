import json
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework import permissions, viewsets, status, views
from rest_framework.response import Response
from authentication.models import Account, AccountManager
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer, FullAccountSerializer
import os

class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)



class LoginView(views.APIView):
    def post(self, request, format=None):
        data = json.loads(request.body)

        email = data.get('email', None)
        password = data.get('password', None)

        account = authenticate(email=email, password=password)


        if account is not None:
            if account.is_active:
                login(request, account)
                print("Account est authentifie")
                serialized = AccountSerializer(account)

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


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)
        print("Account n'est plus authentifie")
        return Response({}, status=status.HTTP_204_NO_CONTENT)


class FullAccountView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        data = json.loads(request.body)
        email = data.get('email', None)
        account = Account.objects.get(email=email)
        if account is not None:
            serialized = FullAccountSerializer(account)
            return Response(serialized.data)
        else:
            return Response({
                'status': 'Not Found',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)


class AccountView(views.APIView):

    def post(self, request, format=None):
        print("AccountView-> post %s" % request.body)
        data = json.loads(request.body)
        account_id = data['account_id']
        account = Account.objects.get(id=account_id)
        if not account:
            return Response({
                'status': 'Not Found',
                'message': 'This account has not been found.'
            }, status=status.HTTP_404_NOT_FOUND)

        if "credit" in data:
            # Just recrediting account
            credit = int(data['credit'])
            account.credits += credit
            account.save()
            return Response(status.HTTP_200_OK)

        logout(request)
        first_name = data['first_name']
        last_name = data['last_name']
        email = data['email']
        password = data['password']

        account.first_name = first_name
        account.last_name = last_name
        account.email = AccountManager.normalize_email(email)
        account.set_password(password)
        account.save()
        authentification = authenticate(email=email, password=password)
        if authentification is not None:
            if authentification.is_active:
                login(request, authentification)

        return Response(status.HTTP_200_OK)

    def get(self, request, format=None):
        first_name = request.query_params['first_name']
        last_name = request.query_params['last_name']
        email = request.query_params['email']
        queryset = []

        if last_name:
            if first_name:
                if email:
                    queryset = Account.objects.filter(last_name__iexact=last_name, first_name__iexact=first_name,email__iexact=email)
                else:
                    queryset = Account.objects.filter(last_name__iexact=last_name, first_name__iexact=first_name)
            else:
                if email:
                    queryset = Account.objects.filter(last_name__iexact=last_name, email__iexact=email)
                else:
                    queryset = Account.objects.filter(last_name__iexact=last_name)
        else:
            if email:
                if first_name:
                    queryset = Account.objects.filter(email__iexact=email, first_name__iexact=first_name)
                else:
                    queryset = Account.objects.filter(email__iexact=email)
            elif first_name:
                queryset = Account.objects.filter(first_name__iexact=first_name)
            else:
                queryset = Account.objects.all()

        print("queryset : %s" %queryset )

        if not queryset:
            print("not queryset : %s" %queryset )
            if last_name:
                if first_name:
                    if email:
                        queryset = Account.objects.filter(last_name__icontains=last_name, first_name__icontains=first_name,
                                                          email__iexact=email)
                    else:
                        queryset = Account.objects.filter(last_name__icontains=last_name, first_name__icontains=first_name)
                else:
                    if email:
                        queryset = Account.objects.filter(last_name__icontains=last_name, email__icontains=email)
                    else:
                        queryset = Account.objects.filter(last_name__icontains=last_name)
            else:
                if email:
                    if first_name:
                        queryset = Account.objects.filter(email__icontains=email, first_name__icontains=first_name)
                    else:
                        queryset = Account.objects.filter(email__icontains=email)
                elif first_name:
                    queryset = Account.objects.filter(first_name__icontains=first_name)
                else:
                    queryset = Account.objects.all()

        serialized = AccountSerializer(queryset, many=True)
        return Response(serialized.data)


class SettingsView(views.APIView):
    pass


class LandingPageView(views.APIView):
    def index(request):
        return render(request, 'general/general.html', context)


class ConfigView(views.APIView):
    def get(self, request):
        local_dev = bool(os.environ.get('LOCAL_DEV', False))
        response_data = {}
        response_data['local_dev'] = str(local_dev)
        return Response(json.dumps(response_data), content_type="application/json")