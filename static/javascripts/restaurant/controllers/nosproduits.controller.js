/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.restaurant.controllers')
    .controller('NosProduitsController', NosProduitsController);

  NosProduitsController.$inject = ['RestaurantService', 'Authentication', '$scope'];

  function NosProduitsController(RestaurantService, Authentication, $scope) {

      activate();
      $scope.account = Authentication.fullAccount;
      $scope.showNosProducteurs = true;
      $scope.showNotreCharte = false;

      function activate() {
         Authentication.getFullAccount(function(value){
            Authentication.fullAccount = value;
            $scope.account = value;
         });


         $scope.$watch(function() { return RestaurantService.getDisplayStates(); }, function (newValue) {
            console.log("WATCH : ", newValue);
            $scope.showNosProducteurs = newValue['nosproducteurs'];
            $scope.showNotreCharte = newValue['notrecharte'];
         }, true);
      }

      $scope.selectNosProducteurs = function(){
         $scope.showNosProducteurs = true;
         $scope.showNotreCharte = false;
      }

      $scope.selectNotreCharte = function(){
         $scope.showNosProducteurs = false;
         $scope.showNotreCharte = true;
      }
  };



})();