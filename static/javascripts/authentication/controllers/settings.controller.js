/**
* LoginController
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.authentication.controllers')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$location', '$scope', 'Authentication', 'YogaService', '$mdToast'];

  /**
  * @namespace LoginController
  */
  function SettingsController($location, $scope, Authentication, YogaService, $mdToast) {
    var vm = this;
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    activate();
    $scope.account = Authentication.fullAccount;
    $scope.reservedLessonsForAccount = []; /* key : id/value : lesson */
    $scope.transactions = [];
    $scope.updateProfileFields = {first_name:"",
                            last_name:"",
                            email:"",
                            confirmation_password:"",
                            password:""};
    $scope.state = { showUpdateProfile : true,
                     showLessonHistoric : false,
                     showTransactionHistoric : false
                   };

    function activate() {
       Authentication.getFullAccount(function(value){
          $scope.account = value;
          if(angular.equals($scope.account,{})){
             /* Non loggé -> /monespace */
             $location.url('/monespace');
          }else{
             $scope.updateProfileFields.first_name = $scope.account.first_name;
             $scope.updateProfileFields.last_name = $scope.account.last_name;
             $scope.updateProfileFields.email = $scope.account.email;

             /* If there is an on-going (pending) reservation, don't display calendar page, but reservation page */
             YogaService.getReservationsByAccount($scope.account.id, function(success, reservations){
                if(!success){
                   return;
                }
                var now = new Date();
                reservations.forEach( function(reservation){
                   var lesson_id = reservation.lesson.id;
                   var lesson =  reservation.lesson;
                   if(!(lesson_id in $scope.reservedLessonsForAccount)){
                      var start = new Date(lesson.date);
                      lesson.meta = {};
                      lesson.meta.lesson = lesson;
                      lesson.meta.day = start.toLocaleDateString('fr-FR', options);
                      lesson.meta.start = start.getHours() + ":"+(start.getMinutes() < 10 ? '0' : '')+ start.getMinutes();
                      lesson.meta.nb_persons = reservation.nb_personnes;
                      lesson.meta.present = reservation.checked_present;
                      if( (now - start) >= 0){
                         lesson.meta.finished = true;
                      }else{
                         lesson.meta.finished = false;
                      }
                      $scope.reservedLessonsForAccount.push(lesson);
                   }
                });
                $scope.reservedLessonsForAccount.sort(compareDates);
             });

             YogaService.getTransactionsByAccount($scope.account.id, function(success, transactions){
                if(!success){
                   return;
                }
                transactions.forEach(function(transaction){
                   var date = new Date(transaction.created);
                   transaction.meta = {};
                   transaction.meta.date = date.toLocaleDateString('fr-FR', options);
                   $scope.transactions.push(transaction);
                });

             });

             $scope.$watch(function() { return Authentication.getSettingsDisplay(); }, function (newValue) {
                 $scope.state.showUpdateProfile = newValue['profile'];
                 $scope.state.showLessonHistoric = newValue['lessons'];
                 $scope.state.showTransactionHistoric = newValue['historic'];
             }, true);
          }
       });
    }

    $scope.showToast = function() {
        $mdToast.show(
          $mdToast.simple()
             .textContent('Votre profil a bien été mis à jour')
             .position("top right")
             .hideDelay(3000)
        );
    }

    $scope.updateProfile = function() {
       console.log("updateProfileFields ", $scope.updateProfileFields);
       if($scope.updateProfileFields.confirmation_password !==$scope.updateProfileFields.password )
       {
          $scope.error = "Les 2 mots de passe sont différents";
          return;
       }

       Authentication.updateProfile(
          $scope.account.id,
          $scope.updateProfileFields.first_name,
          $scope.updateProfileFields.last_name,
          $scope.updateProfileFields.email,
          $scope.updateProfileFields.password,
          function(success, message){
             if(!success){
                 $scope.error = message;
                 $scope.success = "";
             }else{
                 //$scope.success = message;
                 $scope.error = "";

                 $scope.showToast();
             }
          }
       );


      //Authentication.register(vm.email, vm.password, vm.last_name, vm.first_name);
    }

    $scope.changeForm = function(){
       $scope.error = "";
    }

    function compareDates(lesson1, lesson2){
       if(lesson1.date < lesson2.date){
          return -1;
       }
       if(lesson1.date > lesson2.date){
          return 1;
       }
       return 0;
    }

    /* Function called when the cancellation button is clicked by user */
    $scope.cancelReservation = function(lesson, account){
        $scope.alert_message = [];
        YogaService.getReservation(lesson, account, function(success, reservation){
           if(!success){
              $scope.alert_message = message;
              $scope.alert_message_color = "red";
              return;
           }
           if (reservation == undefined){
                $scope.alert_message = "Impossible d'annuler cette réservation";
                $scope.alert_message_color = "red";
                return;
           }
           reservation = reservation[0];
           /* Delegate actual to YogaCancellationController on cancellation page */
           YogaService.stageCancellation(reservation, "settings");
        });
    }

    $scope.gotoCalendar = function(){
       YogaService.gotoCalendar();
    }

    $scope.selectUpdateProfile = function(){
       $scope.state.showUpdateProfile = true;
       $scope.state.showLessonHistoric = false;
       $scope.state.showTransactionHistoric = false;
    }

    $scope.selectLessonHistoric = function(){
       $scope.state.showUpdateProfile = false;
       $scope.state.showLessonHistoric = true;
       $scope.state.showTransactionHistoric = false;
    }

    $scope.selectTransactionHistoric = function(){
       $scope.state.showUpdateProfile = false;
       $scope.state.showLessonHistoric = false;
       $scope.state.showTransactionHistoric = true;
    }
  }
})();