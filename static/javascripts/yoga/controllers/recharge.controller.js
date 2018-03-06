/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.yoga.controllers')
    .controller('RechargeController', RechargeController);


  RechargeController.$inject = ['YogaService', 'Authentication', '$scope', '$location' ];

  function RechargeController( YogaService, Authentication, $scope, $location) {





  };

})();