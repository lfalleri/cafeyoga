/**
* LandingPageController
* @namespace thinkster.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.controllers')
    .controller('LandingPageController', LandingPageController);

  LandingPageController.$inject = ['$scope', 'Authentication', 'Layout', '$mdMedia'];

  /**
  * @namespace NavbarController
  */
  function LandingPageController($scope, Authentication, Layout, $mdMedia) {
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

    $scope.items = [
       {text:"Restaurant",
        text_xs:"Restaurant",
        notes:"Découvrir notre carte ou réserver une table",
        img:"/static/img/photo_restaurant.jpg",
        link:"/restaurant/nosproduits"},
       {text:"Yoga",
        text_xs:"Yoga",
        notes:"Découvrir nos cours et nos professeurs",
        img:"/static/img/photo_yoga.jpg",
        link:"/yoga/calendrier"},
       {text:"Boutique & Expositions",
        text_xs:"Boutique",
        notes:"Découvrir nos artisans partenaires",
        img:"/static/img/photo_boutique.jpg",
        link:"/boutique/createurs"},
       {text:"Evenements",
        text_xs:"Evenements",
        notes:"Découvrir nos évènements",
        img:"/static/img/photo_evenements.jpg",
        link:"/"},
    ];

    $scope.portrait = $mdMedia('portrait');
    $scope.landscape = $mdMedia('landscape');

    this.$doCheck = function(){
       $scope.portrait = Layout.detectScreenOrientation();
    }
  }
})();