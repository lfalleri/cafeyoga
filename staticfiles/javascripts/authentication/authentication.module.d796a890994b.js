(function () {
  'use strict';

  angular
    .module('cafeyoga.authentication', [
      'cafeyoga.authentication.controllers',
      'cafeyoga.authentication.services'
    ]);

  angular
    .module('cafeyoga.authentication.controllers', []);

  angular
    .module('cafeyoga.authentication.services', ['ngCookies']);
})();