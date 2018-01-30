/**
* Authentication
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.restaurant.services')
    .factory('RestaurantService', RestaurantService);

  RestaurantService.$inject = ['$http','$q'];

  /**
  * @namespace Reservations
  * @returns {Factory}
  */
  function RestaurantService($http, $q) {
    /**
    * @name Reservations
    * @desc The Factory to be returned
    */
    var RestaurantService = {
       getMenu: getMenu,
       allReservations : allReservations,
       createReservation : createReservation
    }

    return RestaurantService;

    ////////////////////

    /**
    * @name allReservations
    * @desc Get all Reservations
    * @returns {Promise}
    * @memberOf thinkster.reservations.ReservationService
    */
    function allReservations() {
      return $http.get('api/v1/restaurant/reservation/');
    }

    /**
    * @name createReservation
    * @desc Create a new Reservation
    * @param {string} content The content of the new Post
    * @returns {Promise}
    * @memberOf thinkster.reservations.ReservationService
    */
    function createReservation(lesson, account, callback) {
      console.log("RestaurantService.createReservation() => ",lesson, account);
      return $http.post('api/v1/restaurant/reservation/', {
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
    * @name getMenu
    * @desc Return the menu
    * @returns {object|undefined} Events
    * @memberOf thinkster.reservations.services.Reservations
    */
    function getMenu() {
       //var defer = $q.defer();
       return $http.get('/api/v1/restaurant/menu/');//.then(getMenuSuccessFn, getMenuErrorFn);

        /**
        * @name registerSuccessFn
        * @desc Log the new user in
       */
       function getMenuSuccessFn(data, status, headers, config) {
           console.log("getMenuSuccessFn : ", data.data);

           return menu_dict;
       }

       /**
       * @name registerErrorFn
       * @desc Log "Epic failure!" to the console
       */
       function getMenuErrorFn(data, status, headers, config) {
          console.error('getMenu failed : ');
       }
    }
  }
})();

