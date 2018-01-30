/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.yoga.controllers')
    .controller('YogaController', YogaController);


  YogaController.$inject = ['YogaService', 'Authentication', '$scope', 'moment', '$uibModal', 'calendarConfig'];

  function YogaController( YogaService, Authentication, $scope, moment, $uibModal, calendarConfig) {

      console.log("YogaController");

      var vm = this;
      activate();
      $scope.account = Authentication.fullAccount;

      function activate() {
         Authentication.getFullAccount(function(value){
            Authentication.fullAccount = value;
            $scope.account = value;
         });
      }

      var INTENSITY_COLOR = {
          Debutant:"#0faa45",
          Basique:'#1271ba',
          Intermediaire:'#dbd40f',
          Intensif:'#d62506',
          Expert:'#1e1919'
      };
      var TYPE_COLOR = {
          Hatha:"#17822e",
          Ashtanga:'#a07828',
          Vinyasa:'#8028a0',
          Bikram:'#1f5f7a'
      };

      vm.reserveLesson = function(lesson, account){
          if( account.credits < lesson.price )
          {
              $scope.alert_message = "Vous n'avez pas assez de crédits pour réserver ce cours";
              $scope.alert_message_color = "red";
          }
          else{
              $scope.alert_message = undefined;
              console.log("Bonjour : " +  account.first_name + " " + account.last_name);
              console.log("Vous avez réservé ce cours : ", lesson);
              YogaService.createReservation(lesson, account, function(message){
                  $scope.alert_message = message;
                  $scope.alert_message_color = "green";
                  $scope.account.credits = $scope.account.credits - lesson.price;
              });
          }

      }

     /* function show(reservationFunc, lesson, account) {
           return $uibModal.open({
               templateUrl: 'static/templates/yoga/modalContent.html',
                   controller: function() {
                       var vm = this;
                       console.log("Lesson : ", lesson);
                       console.log("Account : ", account);
                       vm.lesson = lesson;
                       vm.account = account;
                       vm.createReservation = function(lesson){
                           reservationFunc(lesson, account);
                       }
                   },
                   controllerAs: 'vm'
           });
      };*/

      /* On récupère toutes les lessons */
      var promise = YogaService.getLessons();
      var lessons = [];
      $scope.events = [];
      var temp_closest_lesson = undefined;


      promise.then(function(value){
        /* Une fois que le promise est résolu, on parcourt chaque lesson pour le rajouter dans vm.events */
        var now = new Date();
        var diff_min = Number.MAX_SAFE_INTEGER;

        lessons = value.data;

        lessons.forEach(function (lesson) {
               /* ui-calendar events */
               var tmp_event = {};

               tmp_event.start = new Date(lesson.date);
               tmp_event.end = moment(lesson.date).add(lesson.duration, 'm').toDate();

               if( (tmp_event.start - now) <0)
               {
                  tmp_event.borderColor = "#9a9ca0";
                  tmp_event.backgroundColor = "#9a9ca0";
                  tmp_event.panel_description = "(Terminé) "
               }
               else{
                  if ((tmp_event.start - now) < diff_min){
                     diff_min = tmp_event.start - now;
                     temp_closest_lesson = tmp_event;
                  }
                  tmp_event.borderColor = INTENSITY_COLOR[lesson.intensity];
                  tmp_event.backgroundColor = TYPE_COLOR[lesson.type];
                  tmp_event.panel_description = ""
               }

               tmp_event.title = lesson.type + ' ' +
                                 lesson.intensity + ' - ' +
                                 lesson.animator + ' - ' +
                                 tmp_event.start.getHours() + ":"+
                                 (tmp_event.start.getMinutes() < 10 ? '0' : '') +  tmp_event.start.getMinutes();

               tmp_event.panel_description += lesson.type + ' ' +
                                             lesson.intensity + ' - ' +
                                             lesson.animator
               tmp_event.allDay = false;
               tmp_event.data = lesson;
               tmp_event.stick = true;
               //tmp_event.editable= Authentication.isStaff();



               $scope.events.push(tmp_event);
        });

        /* Display information about closest next lesson */
        $scope.description = temp_closest_lesson.panel_description;
        $scope.start = temp_closest_lesson.start.getHours() + ":"+
                       (temp_closest_lesson.start.getMinutes() < 10 ? '0' : '') +  temp_closest_lesson.start.getMinutes();
        $scope.duration = temp_closest_lesson.data.duration;
        $scope.lesson = temp_closest_lesson.data;

      });



      /* ui-calendar object configuration */
      $scope.eventSources = [$scope.events];

      /* Calendar config object */
      $scope.uiConfig = {
          calendar:{
            timezone:'Europe/Paris',
            allDaySlot: false,
            defaultView: 'agendaWeek',
            height: 500,
            firstDay: 1,
            handleWindowResize:true,
            views: {
                week: { // name of view
                timeFormat: 'HH:mm',
                columnFormat: 'ddd D/M'
                }
            },
            selectable: true,
            slotLabelFormat : 'HH:mm',
            minTime:"11:00:00",
            maxTime:"22:00:00",
            //editable: Authentication.isStaff(),
            dayNames:["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
            dayNamesShort:["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            aspectRatio: 1,
            height: 560,
            header:{
              center: 'title',
              right: 'prev,next'
            },
            eventClick: function(calEvent, jsEvent, view) {
                    show(reserveLesson, calEvent.data, Authentication.getAuthenticatedAccount());
                    //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                    //alert('View: ' + view.name);
                    // change the border color just for fun

                    $(this).css('border-color', 'red');

            },
            eventMouseover: function(calEvent, jsEvent, view) {
                   $scope.description = calEvent.panel_description;
                   $scope.start = calEvent.start.toDate().getHours() + ":"+
                                  (calEvent.start.toDate().getMinutes() < 10 ? '0' : '') +  calEvent.start.toDate().getMinutes();
                   $scope.duration = calEvent.data.duration;
                   $scope.lesson = calEvent.data;
                   $(this).css('cursor','pointer');
            },
          }
      };

  };

})();