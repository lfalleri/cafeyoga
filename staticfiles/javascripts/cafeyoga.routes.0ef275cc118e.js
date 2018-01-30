(function () {
  'use strict';

  angular
    .module('cafeyoga.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider.when('/register', {
      controller: 'RegisterController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/register.html'
    }).when('/login', {
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/login.html'
    }).when('/settings', {
      controller: 'SettingsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/settings.html'
    }).when('/yoga', {
      controller: 'YogaController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/yoga/calendar.html'
    }).when('/presentation',{
      controller: 'LandingPageController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/general/presentation.html'
    }).when('/restaurant',{
      controller: 'RestaurantController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/restaurant/nosproduits.html'
    }).when('/notrecharte',{
      controller: 'RestaurantController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/restaurant/notrecharte.html'
    }).when('/carte',{
      controller: 'RestaurantController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/restaurant/carte.html'
    }).when('/',{
      controller: 'LandingPageController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/general/landingpage.html'
    }).otherwise({
       redirectTo:"/"
    });
  }
})();