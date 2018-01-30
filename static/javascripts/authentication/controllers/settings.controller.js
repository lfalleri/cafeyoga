/**
* LoginController
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.authentication.controllers')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace LoginController
  */
  function SettingsController($location, $scope, Authentication) {
    var vm = this;

    activate();
    $scope.account = Authentication.fullAccount;

    function activate() {
         console.log("COUCOU");
         if( !Authentication.isAuthenticated() ){
             $location.url('/');
         }
         Authentication.getFullAccount(function(value){
            $scope.account = value;
         });
    }

    function update() {
      console.log("register.controller.register() "+vm.email + " " + vm.password + " " + vm.username + " " + vm.first_name + " " + vm.last_name);

      Authentication.register(vm.email, vm.password, vm.last_name, vm.first_name);
    }

  }
})();