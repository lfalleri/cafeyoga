/**
* LandingPageController
* @namespace thinkster.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.controllers')
    .controller('LandingPageController', LandingPageController);

  LandingPageController.$inject = ['$scope', 'Authentication'];

  /**
  * @namespace NavbarController
  */
  function LandingPageController($scope, Authentication) {
    var vm = this;

    vm.logout = logout;


    /**
    * @name logout
    * @desc Log the user out
    * @memberOf thinkster.layout.controllers.NavbarController
    */
    function logout() {
      Authentication.logout();
    }
  }
})();