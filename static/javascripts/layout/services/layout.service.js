/**
* Layout
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.services')
    .factory('Layout', Layout);

  Layout.$inject = ['$mdMedia'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Layout($mdMedia) {

    var Layout = {
      detectScreenOrientation: detectScreenOrientation,
    };

    return Layout;

    function detectScreenOrientation() {
       return $mdMedia('portrait');
    }
  }
})();