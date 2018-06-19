/**
* LandingPageController
* @namespace thinkster.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.controllers')
    .controller('LandingPageController', LandingPageController);

  LandingPageController.$inject = ['$scope', 'Authentication', 'Layout', '$mdMedia', '$mdToast'];

  /**
  * @namespace NavbarController
  */
  function LandingPageController($scope, Authentication, Layout, $mdMedia, $mdToast) {
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
        link:"/restaurant/carte"},
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
        link:"/evenements"},
    ];

    $scope.portrait = $mdMedia('portrait');
    $scope.landscape = $mdMedia('landscape');

    this.$doCheck = function(){
       $scope.portrait = Layout.detectScreenOrientation();
       var view = angular.element( document.querySelector( '#view' ) );
       if($scope.portrait){
          view.removeClass('cy-view-landscape');
          view.addClass('cy-view-portrait');
       }else{
          view.addClass('cy-view-landscape');
          view.removeClass('cy-view-portrait');
       }
    }

    $scope.showToast = function() {
        $mdToast.show(
          $mdToast.simple()
             .textContent('Votre profil a bien été mis à jour')
             .position("top right")
             .hideDelay(3000)
        );
    }

    activate();

    function activate() {
       if(!Layout.getUserAcceptedCookies() && !Layout.isToastShown()){
          Layout.toastShow();
          var toast = $mdToast.simple()
                   .textContent('En poursuivant votre navigation sur ce site, vous acceptez l’utilisation de cookies pour vous proposer une meilleure qualité de service')
                   .action('OK')
                   .highlightAction(true)
                   .position('top')
                   .hideDelay(0);

          $mdToast.show(toast).then(function(response) {
             if ( response == 'ok' ) {
                Layout.setUserAcceptedCookies();
                Layout.toastHide();
             }
          });
       }

    }
  }
})();