/**
* LandingPageController
* @namespace thinkster.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.controllers')
    .controller('ContactController', ContactController);

  ContactController.$inject = ['$scope', 'Authentication'];

  /**
  * @namespace NavbarController
  */
  function ContactController($scope, Authentication) {
    var vm = this;

    $scope.questions = ["Réserver une table", "Contacter notre équipe"];
    $scope.button_text = ["Réserver", "Envoyer"];
    $scope.submit_button = "Réserver";

    $scope.initialize = function() {
       console.log( "ContactController initialize_map");
       var loc = {lat: 48.858713, lng: 2.378991};
       var map = new google.maps.Map(document.getElementById('map_div'), {
          zoom: 16,
          center: loc
       });
       var marker = new google.maps.Marker({
          position: loc,
          map: map
       });
    }

    $(document).ready( function () {
        $scope.initialize();
    });


    /* $(document).on('pageshow', '#wrapper', function(e, data){
       $scope.initialize();
     });*/
    console.log( "ContactController");

    $scope.changeQuestion = function(){
       console.log( "question : ",$scope.selectedQuestion);
       $scope.questions.forEach(function(question, i){
          if(question === $scope.selectedQuestion){
             $scope.submit_button = $scope.button_text[i];
          }
       });

    }
  }
})();