/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace RegisterController
  */
  function RegisterController($location, $scope, Authentication) {
    var vm = this;

    vm.register = register;
    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf thinkster.authentication.controllers.RegisterController
     */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }
    }

    /**
    * @name register
    * @desc Register a new user
    * @memberOf thinkster.authentication.controllers.RegisterController
    */
    function register() {
      console.log("register.controller.register() "+vm.email + " " + vm.password + " " + vm.username + " " + vm.first_name + " " + vm.last_name);
      console.log("password : ",vm.password);
      console.log("confirm password : vm.confirm_password");
      if (vm.password === vm.confirm_password){

         Authentication.register(vm.email, vm.password, vm.last_name, vm.first_name);
         $scope.message = "Votre profil a bien été créé";
      }
      else{
         $scope.message = "Vos deux mots de passes sont différents";
      }
    }
  }
})();