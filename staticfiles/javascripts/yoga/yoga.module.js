(function () {
  'use strict';

  var yoga = angular
    .module('cafeyoga.yoga', [
      'cafeyoga.yoga.controllers',
      'cafeyoga.yoga.services'
    ]);



  angular
    .module('cafeyoga.yoga.controllers', [
      'mwl.calendar',
      'angularMoment',
      'ui.bootstrap',
      'cafeyoga.authentication.services',
      'ui.calendar',
  ]);

  angular
    .module('cafeyoga.yoga.services', []);

})();