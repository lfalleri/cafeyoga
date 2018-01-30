/**
* Authentication
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http', '$rootScope'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Authentication($cookies, $http, $rootScope) {
    /**
    * @name Authentication
    * @desc The Factory to be returned
    */
    var Authentication = {
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      login: login,
      logout: logout,
      register: register,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate,
      getFullAccount: getFullAccount,
      isStaff: isStaff,
      fullAccount : {},
    };

    return Authentication;

    ////////////////////

    /**
    * @name register
    * @desc Try to register a new user
    * @param {string} username The username entered by the user
    * @param {string} password The password entered by the user
    * @param {string} email The email entered by the user
    * @returns {Promise}
    * @memberOf thinkster.authentication.services.Authentication
    */
    function register(email, password,last_name, first_name) {
      console.log("Authentication.register() "+email + " " + password + " " + first_name + " " + last_name);
      return $http.post('/api/v1/accounts/', {
        password: password,
        email: email,
        last_name: last_name,
        first_name: first_name,
      }).then(registerSuccessFn, registerErrorFn);

      /**
      * @name registerSuccessFn
      * @desc Log the new user in
      */
      function registerSuccessFn(data, status, headers, config) {
        Authentication.login(email, password);
      }

      /**
      * @name registerErrorFn
      * @desc Log "Epic failure!" to the console
      */
      function registerErrorFn(data, status, headers, config) {
        console.error('Registration failed' + status);
        alert("Echec de l'enregistrement");
      }
    }

    /**
    * @name login
    * @desc Try to log in with email `email` and password `password`
    * @param {string} email The email entered by the user
    * @param {string} password The password entered by the user
    * @returns {Promise}
    * @memberOf thinkster.authentication.services.Authentication
    */
    function login(email, password) {
       return $http.post('/api/v1/auth/login/', {
          email: email, password: password
       }).then(loginSuccessFn, loginErrorFn);

      /**
       * @name loginSuccessFn
       * @desc Set the authenticated account and redirect to index
       */
      function loginSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount(data.data);
        Authentication.getFullAccount(function(fullAccount){
            Authentication.fullAccount = fullAccount;
        });
        $rootScope.back();
        //window.location = '/';
      }

      /**
       * @name loginErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function loginErrorFn(data, status, headers, config) {
        console.error('Login failed : ' + status);
        alert('Email ou mot de passe invalide');
      }
    }

    /**
     * @name logout
     * @desc Try to log the user out
     * @returns {Promise}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function logout() {
       return $http.post('/api/v1/auth/logout/')
          .then(logoutSuccessFn, logoutErrorFn);

        /**
        * @name logoutSuccessFn
        * @desc Unauthenticate and redirect to index with page reload
        */
       function logoutSuccessFn(data, status, headers, config) {
         Authentication.unauthenticate();
         Authentication.fullAccount = {};
         //window.location = '/';
         $rootScope.back();
       }

       /**
        * @name logoutErrorFn
        * @desc Log "Epic failure!" to the console
        */
       function logoutErrorFn(data, status, headers, config) {
         console.error('Epic failure!');
       }
    }

    /**
    * @name getAuthenticatedAccount
    * @desc Return the currently authenticated account
    * @returns {object|undefined} Account if authenticated, else `undefined`
    * @memberOf thinkster.authentication.services.Authentication
    */
    function getAuthenticatedAccount() {
       if (!$cookies.authenticatedAccount) {
          return;
       }

       return JSON.parse($cookies.authenticatedAccount);
    }

    /**
     * @name isAuthenticated
     * @desc Check if the current user is authenticated
     * @returns {boolean} True is user is authenticated, else false.
     * @memberOf thinkster.authentication.services.Authentication
     */
    function isAuthenticated() {
       return !!$cookies.authenticatedAccount;
    }

    /**
     * @name setAuthenticatedAccount
     * @desc Stringify the account object and store it in a cookie
     * @param {Object} user The account object to be stored
     * @returns {undefined}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function setAuthenticatedAccount(account) {
       $cookies.authenticatedAccount = JSON.stringify(account);
    }

    /**
     * @name unauthenticate
     * @desc Delete the cookie where the user object is stored
     * @returns {undefined}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function unauthenticate() {
       delete $cookies.authenticatedAccount;
    }

    function getFullAccount(callback) {

       if(!angular.equals({},Authentication.fullAccount)){
          console.log("Already collected fullAccount = ",Authentication.fullAccount, callback);
          callback(Authentication.fullAccount);
          return Authentication.fullAccount;
       }
       var account =  Authentication.getAuthenticatedAccount();
       if( !account )
       {
          return;
       }
       return $http.post('/api/v1/auth/account/', {
          email: account.email
       }).then(function(data, status, headers, config){
          Authentication.fullAccount = data.data;
          callback(data.data);
          return Authentication.fullAccount;
       }, function(data, status, headers, config) {
         console.error('Login failed : ' + status);
         alert('Email ou mot de passe invalide');
       });
    }

    function isStaff() {
      var account = Authentication.getFullAccount(function(account){
         if(!account){
           return false;
         }
         return account.is_staff;
      });
    }
  }
})();