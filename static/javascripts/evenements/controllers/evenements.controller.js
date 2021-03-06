(function () {
  'use strict';

  angular
    .module('cafeyoga.evenements.controllers')
    .controller('EvenementsController', EvenementsController);


  EvenementsController.$inject = ['EvenementsService', 'Authentication', '$scope', '$location' ];

  function EvenementsController( EvenementsService, Authentication, $scope, $location) {

     activate();
     $scope.evenements = [];
     $scope.avenir = [];
     $scope.passes = [];
     $scope.event_to_show = undefined;
     $scope.state = { showEvenementsAVenir : true,
                      showEvenementsPasses : false,
                      showDetails : false,
                    };
     var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

     function activate() {
         EvenementsService.getAllEvenements(function(success, evenements){
            if(!success) return;

            $scope.evenements = evenements;

            var now = new Date();
            evenements.forEach(function(e){
            var e_date = new Date(e.date);

            e.locale_date = e_date.toLocaleDateString('fr-FR', options);
               if( (e_date - now) <0){
                  $scope.passes.push(e);
               }else{
                  $scope.avenir.push(e);
               }
            });
         });

         $scope.$watch(function() { return EvenementsService.getEvenementsDisplay(); }, function (newValue) {
                 $scope.state.showEvenementsAVenir = newValue['a venir'];
                 $scope.state.showEvenementsPasses = newValue['passes'];

                 console.log("Avenir : ",  $scope.state.showEvenementsAVenir );
                 console.log("Passes : ",  $scope.state.showEvenementsPasses );
         }, true);
     }

     $scope.showDetails = function(evenement){
        console.log("evenement : ",  evenement );
        $scope.event_to_show = evenement;
        console.log("event_to_show : ",  $scope.event_to_show );
        $scope.state.showDetails = true;
     }

     $scope.hideDetails = function(){
        $scope.event_to_show = undefined;
        $scope.state.showDetails = false;
     }

  };

})();