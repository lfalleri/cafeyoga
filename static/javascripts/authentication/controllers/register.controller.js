/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location','$http', '$scope', 'Authentication', 'vcRecaptchaService'];

  /**
  * @namespace RegisterController
  */
  function RegisterController($location, $http, $scope, Authentication, vcRecaptchaService) {
    var vm = this;

    $scope.register = {};
    $scope.login = {};
    $scope.response = null;
    $scope.widgetId = null;
    $scope.model = {
       key: '6LcqC1MUAAAAANRMW5g0oN7tufDBTLUI2Lg9lCQ-'
    };

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf thinkster.authentication.controllers.RegisterController
     */
    function activate() {
       // If the user is authenticated, they should not be here.
       /*

       if (Authentication.isAuthenticated()) {
         $location.url('/settings');
       }*/

       Authentication.getFullAccount(function(value){
         $scope.account = value;
         if(angular.equals($scope.account,{})){
         }else{
           /* Loggé -> /settings */
           $location.url('/settings');
         }
       });
    }

    /**
    * @name register
    * @desc Register a new user
    * @memberOf thinkster.authentication.controllers.RegisterController
    */
    $scope.registerUser = function() {

       var valid = false;
                    /**
                     * SERVER SIDE VALIDATION
                     *
                     * You need to implement your server side validation here.
                     * Send the reCaptcha response to the server and use some of the server side APIs to validate it
                     * See https://developers.google.com/recaptcha/docs/verify
                     */
      /* $http.post(
          'https://www.google.com/recaptcha/api/siteverify',
          {
             data: {
                secret: '6LcqC1MUAAAAANnGry5P9O8o7hGox_rHlkAUSAWN',
                response: $scope.response,
             },
             headers:{'Content-Type': 'application/json' ,
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Headers': 'X-Requested-With',
                      }
          }
       )
       .then( function(data, status, headers, config) {
          console.log("RESPONSE received from Google : ", data);
       });*/
       if($scope.response){
          valid = true;
       }

       console.log('sending the captcha response to the server', $scope.response);
       if (valid) {
          console.log('Success');
       } else {
          console.log('Failed validation');
          // In case of a failed validation you need to reload the captcha
          // because each response can be checked just once
          vcRecaptchaService.reload($scope.widgetId);
          $scope.register_error = "Veuillez prouver que vous n'êtes pas un robot";
          return;
       }

       console.log("register.controller.register() "
            +$scope.register.email + " " + $scope.register.password + " "+ $scope.register.first_name + " " + $scope.register.last_name);


       if ($scope.register.password === $scope.register.confirm_password){
          Authentication.register($scope.register.email,
                                  $scope.register.password,
                                  $scope.register.last_name,
                                  $scope.register.first_name,
                                  function(success,message){
              if(!success){
                 $scope.register_error = "Votre email est déjà utilisé";
              }

          });
          $scope.message = "Votre profil a bien été créé";
       }
       else{
          $scope.message = "Vos deux mots de passes sont différents";
       }
    }

    $scope.loginUser = function() {
       console.log("register.controller.login()  : ",$scope.login.email," ",$scope.login.password);
       Authentication.login($scope.login.email, $scope.login.password, true, function(success, message){
          if(!success){
             $scope.error = "Identifiant ou mot de passe invalide";
          }
       });
    }



    $scope.setResponse = function (response) {
       console.info('Response available');
       $scope.response = response;
    };

    $scope.setWidgetId = function (widgetId) {
       console.info('Created widget ID: %s', widgetId);
       $scope.widgetId = widgetId;
    };

    $scope.cbExpiration = function() {
       console.info('Captcha expired. Resetting response object');
       vcRecaptchaService.reload($scope.widgetId);
       $scope.response = null;
    };
  }
})();