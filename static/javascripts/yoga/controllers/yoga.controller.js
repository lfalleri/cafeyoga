/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.yoga.controllers')
    .controller('YogaController', YogaController);

  YogaController.$inject = ['YogaService', 'Authentication', '$scope', 'moment', '$uibModal', '$location' ];

  function YogaController( YogaService, Authentication, $scope, moment, $uibModal, $location) {

     var INTENSITY_COLOR = {
          Debutant:"#0faa45",
          Basique:'#1271ba',
          Intermediaire:'#dbd40f',
          Intensif:'#d62506',
          Expert:'#1e1919'
     };
     var TYPE_COLOR = {
          Hatha:["#17822e", "#4aa55e"],
          Ashtanga:['#a07828','#c19e57'] ,
          Vinyasa:['#8028a0','#a051bc'],
          Bikram:['#1f5f7a','#488aa5'],
     };
     var EVENT_COLOR = {
          Hatha:{reservable : "#17822e", focused :"#4aa55e", complete:"#9a9ca0", reserved:"#14b714"},
          Ashtanga:{reservable :'#a07828',focused :'#c19e57', complete:"#9a9ca0", reserved:"#14b714"},
          Vinyasa:{reservable :'#8028a0',focused :'#a051bc', complete:"#9a9ca0", reserved:"#14b714"},
          Bikram:{reservable :'#1f5f7a',focused :'#488aa5', complete:"#9a9ca0", reserved:"#14b714"},
     };

     var vm = this;
     activate();
     $scope.account = Authentication.fullAccount;
     $scope.reservationParams = {nb_persons : 1};
     $scope.reservedLessonIdForAccount = [];
     $scope.reservedLessons = [];
     $scope.events = [];
     $scope.lesson_to_display = false;
     $scope.nb_places = 12;
     $scope.staff = {
          reservationsForLesson:[],
          addUser : {
             displaySearchUserForm:false,
             displaySearchedAccounts:false,
             displayDetailedAccount:false,
             nb_persons:0,
             searchedAccounts:[],
             selectedAccount:undefined,
          }
     };

     var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

     function activate() {
         Authentication.getFullAccount(function(value){
            $scope.account = value;
            if(angular.equals($scope.account,{})){
               getAllLessons();
            }else{
               /* If there is an on-going (pending) reservation, don't display calendar page, but reservation page */
               YogaService.gotoReservationIfAny($scope.account);

               YogaService.getReservationsByAccount($scope.account.id, function(success, reservations){
               if(!success){
                  return;
               }
               console.log("YogaController : reservation pour ", $scope.account, " : ", reservations);
               reservations.forEach( function(reservation){
                   if (!$scope.reservedLessonIdForAccount.includes(reservation.lesson.id)){
                      $scope.reservedLessonIdForAccount.push(reservation.lesson.id);
                   }
               });
               getAllLessons();
            });
            }
         });
     }

     function getAllLessons(){
        /* On récupère toutes les lessons */
        var promise = YogaService.getAllLessons();
        var lessons = [];
        var closest_lesson = undefined;

        promise.then(function(value){
           /* Une fois que le promise est résolu, on parcourt chaque lesson pour le rajouter dans vm.events */
           var now = new Date();
           var diff_min = Number.MAX_SAFE_INTEGER;
           lessons = value.data;
           lessons.forEach(function (lesson) {
               lesson.reservedByAccount = false;
               lesson.cancelable = false;
               lesson.reservable = true;
               if($scope.reservedLessonIdForAccount.includes(lesson.id)){
                  lesson.reservedByAccount = true;
                  lesson.cancelable = true;
                  lesson.reservable = false;
               }

               /* ui-calendar events */
               var new_event = {};
               new_event.start = new Date(lesson.date);
               new_event.end = moment(lesson.date).add(lesson.duration, 'm').toDate();

               /* Check if lesson is in the past */
               if( (new_event.start - now) <0){
                  new_event.borderColor = "#9a9ca0";
                  new_event.backgroundColor = "#9a9ca0";
                  new_event.title = lesson.type + ' ' + lesson.intensity + '\n' +
                                    lesson.animator.prenom + ' ' + lesson.animator.nom;
                  lesson.display_title = "Cours sélectionné (Terminé):";
                  lesson.reservable = false;
                  lesson.cancelable = false;
               }
               else{
                  if (lesson.reservedByAccount){
                     /* Lesson reserved by user */
                     lesson.display_title = "Cours sélectionné (Réservé):";

                     new_event.borderColor = INTENSITY_COLOR[lesson.intensity];
                     new_event.backgroundColor = EVENT_COLOR[lesson.type].reserved;
                     new_event.title = lesson.type + ' ' + lesson.intensity + ' (Réservé)\n' +
                                       lesson.animator.prenom + ' ' +lesson.animator.nom;

                     var reservedLesson = {};
                     reservedLesson.description = lesson.type+' '+lesson.intensity+' - '+
                                                  lesson.animator.prenom +' ' + lesson.animator.nom;
                     reservedLesson.day = new_event.start.toLocaleDateString('fr-FR', options);
                     reservedLesson.start = new_event.start.getHours() + ":"+
                                            (new_event.start.getMinutes() < 10 ? '0' : '') +
                                            new_event.start.getMinutes();
                     reservedLesson.duration = lesson.duration;
                     reservedLesson.nb_places = lesson.nb_places;
                     reservedLesson.id = lesson.id;
                     $scope.reservedLessons.push(reservedLesson);

                     if ((new_event.start - now) < diff_min){
                           diff_min = new_event.start - now;
                           closest_lesson = new_event;
                     }
                  }else{
                     /* Lesson not reserved by user; it's either Reservable or Complete */
                     new_event.title = lesson.type + ' ' + lesson.intensity + '\n'
                                     + lesson.animator.prenom +' ' + lesson.animator.nom;
                     if(lesson.nb_places > 0){
                        lesson.display_title = "Cours sélectionné (Réservable):";
                        new_event.borderColor = INTENSITY_COLOR[lesson.intensity];
                        new_event.backgroundColor = EVENT_COLOR[lesson.type].reservable;
                        lesson.reservable = true;
                        if ((new_event.start - now) < diff_min){
                           diff_min = new_event.start - now;
                           closest_lesson = new_event;
                        }
                     }else{
                        lesson.display_title = "Cours sélectionné (Complet):";
                        new_event.borderColor = "#9a9ca0";
                        new_event.backgroundColor = "#9a9ca0";
                        lesson.reservable = false;
                     }
                  }
               }
               new_event.allDay = false;
               new_event.stick = true;

               /* Event information not directly connected with calendar events  : used for display */
               new_event.meta = {};
               new_event.meta.panel_description = lesson.type + ' ' + lesson.intensity + ' - ' +
                                                  lesson.animator.prenom +' ' + lesson.animator.nom;
               new_event.meta.day = new_event.start.toLocaleDateString('fr-FR', options);
               new_event.meta.start = new_event.start.getHours() + ":"+
                       (new_event.start.getMinutes() < 10 ? '0' : '') +  new_event.start.getMinutes();
               new_event.meta.duration = lesson.duration;
               new_event.meta.nb_places = lesson.nb_places;
               new_event.meta.lesson = lesson;

               $scope.events.push(new_event);
            });

           if(closest_lesson){
               /* Display information about closest next lesson */
               $scope.description = closest_lesson.meta.panel_description;
               $scope.day = closest_lesson.meta.day;
               $scope.start = closest_lesson.meta.start;
               $scope.duration = closest_lesson.meta.duration;
               $scope.lesson = closest_lesson.meta.lesson;
               $scope.nb_places = closest_lesson.meta.nb_places;

               if(closest_lesson.meta.lesson.reservedByAccount){
                  $scope.lesson.display_title = "Prochain Cours (Réservé):";
               }else{
                  if(closest_lesson.meta.nb_places > 0){
                     $scope.lesson.display_title = "Prochain Cours (Réservable):";
                  }else{
                     $scope.lesson.display_title = "Prochain Cours (Complet):";
                  }
               }

               $scope.lesson_to_display = true;

               if($scope.account.is_staff){
                   $scope.staff.reservationsForLesson = [];
                   YogaService.getReservationsByLesson($scope.lesson, function(success, reservations){
                       console.log("reservations for lesson : ", reservations);
                       if(!success)return;
                       reservations.forEach(function(reservation){
                           $scope.staff.reservationsForLesson.push(reservation);
                       });
                   });
               }
           }
        });
     }

     $scope.number_of_persons = [];
     for(var i = 1 ; i <= $scope.nb_places ; i++ ){
        $scope.number_of_persons.push(i);
     }

     $scope.eventSources = [$scope.events];

     /* Calendar config object */
     $scope.uiConfig = {
          calendar:{
            timezone:'Europe/Paris',
            allDaySlot: false,
            defaultView: 'agendaWeek',
            height: 500,
            contentHeight: 575,
            firstDay: 1,
            handleWindowResize:true,
            views: {
                week: { // name of view
                timeFormat: 'HH:mm',
                columnFormat: 'ddd D/M',
                columnHeaderFormat: 'ddd',
                axisFormat: 'HH:mm',
                }
            },
            selectable: true,
            slotLabelFormat : 'HH:mm',
            timeFormat : 'HH:mm',
            axisFormat: 'HH:mm',
            minTime:"11:00:00",
            maxTime:"22:00:00",
            dayNames:["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
            dayNamesShort:["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            monthNamesShort :['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin','Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Déc'],
            titleFormat: {
                week:  "[Semaine du] D MMMM  YYYY",
            },
            columnFormat: 'ddd D MMM',
            titleRangeSeparator: ' au ',
            hiddenDays: [  0, 1 ],
            aspectRatio: 3,
            height: 560,
            header:{
              left: ' ',
              center: 'title',
              right: 'prev,next'
            },
            eventClick: function(calEvent, jsEvent, view) {
                   /* Lesson clicked :
                       - display its information (1)
                       - if is staff member : display user registered for this lesson (2)
                       - restore background color and border for previously selected lesson (3)
                       - change background color and border of current lesson (4) */

                   /* (1) */
                   $scope.description = calEvent.meta.panel_description;
                   $scope.day = calEvent.meta.day;
                   $scope.start = calEvent.meta.start;
                   $scope.duration = calEvent.meta.duration;
                   $scope.lesson = calEvent.meta.lesson;
                   $scope.nb_places = calEvent.meta.nb_places;
                   $scope.alert_message = undefined;
                   $scope.reservationParams.nb_persons = 1;

                   /* (2) */
                   if($scope.account.is_staff){
                       $scope.staff.reservationsForLesson = [];
                       YogaService.getReservationsByLesson($scope.lesson, function(success, reservations){
                       console.log("reservations for lesson : ", reservations);
                           if(!success)return;
                           reservations.forEach(function(reservation){
                               $scope.staff.reservationsForLesson.push(reservation);
                           });
                       });
                   }

                   /* (3) */
                   /* Reset previous selected event accordingly to its status (reserved or not)*/
                   if($scope.previous_selected){
                      if($scope.previous_event.meta.lesson.reservedByAccount){
                         $scope.previous_selected.css('backgroundColor', EVENT_COLOR[$scope.previous_event.meta.lesson.type].reserved);
                      }
                      else{
                         $scope.previous_selected.css('backgroundColor', EVENT_COLOR[$scope.previous_event.meta.lesson.type].reservable);
                      }
                      $scope.previous_selected.css('border-color',$scope.previous_selected_border_color);
                      $scope.previous_selected.css('border-width','thin');
                   }
                   if(!calEvent.meta.lesson.reservable &&
                      !calEvent.meta.lesson.cancelable){
                      $scope.previous_selected = undefined;
                      return;
                   }
                   if(calEvent.meta.lesson.reservedByAccount){
                      $scope.previous_selected_background_color = EVENT_COLOR[calEvent.meta.lesson.type].reserved;
                      $(this).css('backgroundColor', EVENT_COLOR[calEvent.meta.lesson.type].reserved);
                   }else{
                      $scope.previous_selected_background_color = EVENT_COLOR[calEvent.meta.lesson.type].reservable;
                      $(this).css('backgroundColor', EVENT_COLOR[calEvent.meta.lesson.type].focused);
                   }

                   /* (4) */
                   $scope.previous_selected = $(this);
                   $scope.previous_event = calEvent;
                   $scope.previous_selected_border_color = $(this).css('border-color');
                   $(this).css('border-color', '#a02019');
                   $(this).css('border-width','medium');
            },
            eventMouseover: function(calEvent, jsEvent, view) {
                   $(this).css('cursor','pointer');
            },
          }
     };

     /* Function called when the reservation button is clicked by user */
     $scope.createReservation = function(lesson, account, reservationParams){
         $scope.alert_message = [];
         if( !lesson.reservable ){
             $scope.alert_message = ["Vous avez déjà réservé ce cours"];
             $scope.alert_message_color = "orange";
             return;
         }
         if( account.credits < (lesson.price * reservationParams.nb_persons) )
         {
             $scope.alert_message = ["Vous n'avez pas assez de crédits pour réserver ce cours"];
             $scope.alert_message_color = "red";
         }
         else{
             if ($scope.reservationParams.nb_persons == undefined){
                $scope.alert_message = ["Veuillez sélectionner un nombre de personnes"];
                $scope.alert_message_color = "red";
                return;
             }
             if(lesson.nb_places < reservationParams.nb_persons){
                $scope.alert_message = ["Nombre de places insuffisant"];
                $scope.alert_message_color = "red";
                return;
             }
             $scope.alert_message = [];

             /*
              Store reservation parameters in YogaService and
              change location to the reservation confirmation page (managed by YogaReservationController)
              */
             YogaService.stageReservation(lesson, account,reservationParams.nb_persons, function(success, message, updated_lesson){
                if(!success){
                    if(updated_lesson != undefined){
                       $scope.lesson.nb_places = updated_lesson.nb_places;
                    }
                    $scope.alert_message = message;
                    $scope.alert_message_color = "red";
                    return;
                }
             });
         }
     }

     /* Function called when the recredite button is clicked by user */
     $scope.recrediteAccount = function(account){
        console.log("recredite ");
        $location.url('/yoga/recharge');
     }

     /* Function called when the cancellation button is clicked by user */
     $scope.cancelReservation = function(lesson, account, live){
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

           if(!live){
              /* Delegate actual to YogaCancellationController on cancellation page */
              YogaService.stageCancellation(reservation, "calendar");
           }else{

               YogaService.cancelReservation(lesson, account, function(success, message){
                   if(!success){
                       $scope.alert_message = message;
                       $scope.alert_message_color = "red";
                       return;
                   }

                   /* Update local information */
                   $scope.account.credits += lesson.price * reservation.nb_personnes;
                   $scope.lesson.nb_places += reservation.nb_personnes;

                   if(live){
                       $scope.staff.reservationsForLesson = $scope.staff.reservationsForLesson.filter(function(el){
                           return el.account.id !== reservation.account.id;
                       });
                       if($scope.staff.addUser.selectedAccount.id == reservation.account.id){
                           $scope.staff.addUser.selectedAccount.credits += (reservation.nb_personnes * reservation.lesson.price);
                       }
                   }
                   $scope.reservedLessons = $scope.reservedLessons.filter(function(el) {return el.id !== lesson.id;});
                   $scope.$apply();
               }); /* cancelReservation() */
           }/* End live case */
        }
     )};


     /* function called when a staff member check someone present */
     $scope.checkedPresent = function(reservation){
        console.log(reservation.account.email + " is present at lesson : "+ reservation.lesson.id);
        console.log("reservation : "+ reservation);
        YogaService
           .checkAccountPresent(
               reservation.lesson,
               reservation.account,
               reservation.checked_present,
                  function(success, message){
                    if(success) console.log("Checked");
                  });
     }

     $scope.displaySearchForm = function(){
        $scope.staff.addUser.displaySearchUserForm = true;
        $scope.staff.addUser.searchedAccounts = [];
        $scope.staff.addUser.displaySearchedAccounts = false;
     }

     $scope.hideSearchForm = function(){
        $scope.staff.addUser.displaySearchUserForm = false;
     }

     $scope.searchUser = function(){
        console.log("$scope.searchUser : nom=",   $scope.staff.addUser.last_name,
                                       " prenom=",$scope.staff.addUser.first_name,
                                       " email=", $scope.staff.addUser.email);
        if($scope.staff.addUser.last_name==undefined){
           $scope.staff.addUser.last_name = "";
        }
        if($scope.staff.addUser.first_name==undefined){
           $scope.staff.addUser.first_name = "";
        }
        if($scope.staff.addUser.email==undefined){
           $scope.staff.addUser.email = "";
        }

        Authentication.getUsers(
            $scope.staff.addUser.last_name,
            $scope.staff.addUser.first_name,
            $scope.staff.addUser.email,
            function(success, accounts){
                if(!success){
                   console.error("Impossible de trouver les utilisateurs");
                }
                if(accounts == []){
                   $scope.staff.addUser.userNotFound = "Aucun utilisateur trouvé";
                   return;
                }
                $scope.staff.addUser.searchedAccounts = accounts;
                $scope.staff.addUser.displaySearchUserForm = false;
                $scope.staff.addUser.displaySearchedAccounts = true;
                $scope.staff.addUser.displayDetailedAccount = false;
                console.log("$scope.staff.addUser.searchedAccounts : ", $scope.staff.addUser.searchedAccounts);
            });
     }

     $scope.hideSearchedAccounts = function(){
        $scope.staff.addUser.displaySearchUserForm = true;
        $scope.staff.addUser.displaySearchedAccounts = false;
        $scope.staff.addUser.displayDetailedAccount = false;
     }

     $scope.staff.addUser.selectSearchedAccount = function(account){
        console.log("selectSearchedAccount : ", account);

        $scope.staff.addUser.displaySearchUserForm = false;
        $scope.staff.addUser.displaySearchedAccounts = false;
        $scope.staff.addUser.displayDetailedAccount = true;
        $scope.staff.addUser.selectedAccount = account;
        $scope.staff.addUser.proceed_credit = 0;
        $scope.staff.addUser.proceed_debit = 0;
     }

     $scope.updateNbPersons = function(){
        if( $scope.staff.addUser.proceed_debit < $scope.lesson.price ){
           $scope.staff.addUser.proceedBalanceError = "Attention, le prix par personne est de "+$scope.lesson.price + " crédits";
           return;
        }
        if( ($scope.staff.addUser.proceed_debit % $scope.lesson.price) != 0 ){
           $scope.staff.addUser.proceedBalanceError = "Attention, débit n'est pas un multiple du prix/personne";
           return;
        }
        $scope.staff.addUser.nb_persons = $scope.staff.addUser.proceed_debit / $scope.lesson.price;
        $scope.staff.addUser.proceedBalanceError = undefined;
     }

     $scope.proceedBalance = function(account, credit,debit){
        console.log("credit : ", credit, " / débit : ", debit);
        if((account.credits + credit - debit) <0){
           $scope.staff.addUser.proceedBalanceError = "Pas assez de crédits";
           return;
        }
        if( debit < $scope.lesson.price ){
           $scope.staff.addUser.proceedBalanceError = "Attention, le prix par personne est de "+$scope.lesson.price + " crédits";
           return;
        }
        if( (debit % $scope.lesson.price) != 0 ){
           $scope.staff.addUser.proceedBalanceError = "Attention, débit n'est pas un multiple du prix/personne";
           return;
        }

        var nb_persons = debit / $scope.lesson.price;
        $scope.staff.addUser.nb_persons = nb_persons;

        YogaService.createLiveReservation($scope.lesson,account, nb_persons, credit, debit, function(success, message, reservation){
            if(!success){
               $scope.staff.addUser.proceedBalanceError = message;
               return;
            }else
            {
                $scope.staff.reservationsForLesson.push(reservation);
                $scope.staff.addUser.nb_persons = 0;
                $scope.staff.addUser.proceedBalanceError = undefined;
                $scope.staff.addUser.selectedAccount.credits += credit - debit;
                $scope.lesson.nb_places -= nb_persons;
                $scope.$apply();
            }




        });
     }

     $scope.hideProceedBalanceForm = function(){
        $scope.staff.addUser.displaySearchUserForm = false;
        $scope.staff.addUser.displaySearchedAccounts = true;
        $scope.staff.addUser.displayDetailedAccount = false;
     }


  };

})();