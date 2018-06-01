/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.boutique.controllers')
    .controller('BoutiqueController', BoutiqueController);


  BoutiqueController.$inject = ['BoutiqueService', 'Authentication', '$scope', '$location' ];

  function BoutiqueController( BoutiqueService, Authentication, $scope, $location) {


     activate();
     $scope.expos = [];
     $scope.showExpoEnCours = true;
     $scope.showExpoPassees = false;

     function activate() {
         BoutiqueService.getAllCreateurs(function(success, createurs){
            if(!success) return;

            $scope.createurs = createurs;
            console.log("Createurs : ", createurs);
         });

         BoutiqueService.getAllExpos(function(success, expos){
            if(!success) return;

            expos.forEach(function(e){
               if(e.en_cours){
                  $scope.currentExposition = e;
               }else{
                  $scope.expos.push(e);
               }
            })

            console.log("Expos : ", expos);
         });

         $scope.$watch(function() { return BoutiqueService.getDisplayStates(); }, function (newValue) {
            console.log("WATCH : ", newValue);
            $scope.showExpoEnCours = newValue['en_cours'];
            $scope.showExpoPassees = newValue['passees'];
         }, true);
     }

  };

})();