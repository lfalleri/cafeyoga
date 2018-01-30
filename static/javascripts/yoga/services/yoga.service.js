/**
* Authentication
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.yoga.services')
    .factory('YogaService', YogaService);

  YogaService.$inject = ['$http','$q'];

  /**
  * @namespace Reservations
  * @returns {Factory}
  */
  function YogaService($http, $q) {
    /**
    * @name Reservations
    * @desc The Factory to be returned
    */
    var YogaService = {
       getLessons: getLessons,
       allReservations : allReservations,
       createReservation : createReservation
    }

    return YogaService;

    ////////////////////

    /**
    * @name allReservations
    * @desc Get all Reservations
    * @returns {Promise}
    * @memberOf thinkster.reservations.ReservationService
    */
    function allReservations() {
      return $http.get('api/v1/yoga/reservation/');
    }

    /**
    * @name createReservation
    * @desc Create a new Reservation
    * @param {string} content The content of the new Post
    * @returns {Promise}
    * @memberOf thinkster.reservations.ReservationService
    */
    function createReservation(lesson, account, callback) {
      console.log("YogaService.createReservation() => ",lesson, account);
      return $http.post('api/v1/yoga/reservation/', {
        lesson: lesson,
        account: account
      }).then(
        function(data, status, headers, config){

          var start = new Date(lesson.date);
          var message = "Votre réservation a bien été prise en compte pour le cours : \n\n\n\n"+
                        lesson.type + " - " + lesson.intensity + " - " + lesson.animator +
                        " - " + start.getHours() + ":"+
                         (start.getMinutes() < 10 ? '0' : '') +  start.getMinutes() +
                         " - " + lesson.duration + " minutes";
          callback(message);
      },function(data, status, headers, config){
          callback("Une erreur est survenue lors de la réservation");
      });
    }

    /**
     * @name getReservations
     * @desc Get the Reservations of a given user
     * @param {string} username The username to get Reservation for
     * @returns {Promise}
     * @memberOf thinkster.reservations.ReservationService
     */
    function getReservations(account) {
      return $http.get('/api/v1/accounts/' + account + '/reservation/');
    }

    /**
    * @name getEvents
    * @desc Return the events
    * @returns {object|undefined} Events
    * @memberOf thinkster.reservations.services.Reservations
    */
    function getLessons() {
       //var defer = $q.defer();
       var promise = $http.get('/api/v1/yoga/lessons/');
       promise.then(getLessonsSuccessFn, getLessonsErrorFn);
       return promise;
        /**
        * @name registerSuccessFn
        * @desc Log the new user in
       */
       function getLessonsSuccessFn(data, status, headers, config) {
           return data.data;
       }

       /**
       * @name registerErrorFn
       * @desc Log "Epic failure!" to the console
       */
       function getLessonsErrorFn(data, status, headers, config) {
          console.error('getLessons failed' + status);
       }
    }
  }
})();

