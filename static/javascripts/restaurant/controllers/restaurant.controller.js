/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.restaurant.controllers')
    .controller('RestaurantController', RestaurantController);


  RestaurantController.$inject = ['RestaurantService', 'Authentication', '$scope'];

  function RestaurantController(RestaurantService, Authentication, $scope) {

      console.log("RestaurantController");

      var vm = this;
      activate();
      $scope.account = Authentication.fullAccount;

      /* On récupère toutes les lessons */
      RestaurantService.getMenu().then(function(value){
         var plats_dict = {};
         var brunch_dict = {};
         var menu = value.data;

         var plats = menu["plats"];
         console.log("menu", menu);
         console.log("plats", plats);

         for (var i = 0; i < plats.length; i++) {
            var plat = plats[i];
            if( !(plat.categorie.titre in plats_dict)){
               var new_categorie = {};
               new_categorie[plat.specificite.titre] = [[plat.denomination, plat.ingredients, plat.prix]];
               plats_dict[plat.categorie.titre] = new_categorie;
            }
            else{
               var categorie_dict = plats_dict[plat.categorie.titre];
               if( !(plat.specificite.titre in categorie_dict)){
                  categorie_dict[plat.specificite.titre] = [[plat.denomination, plat.ingredients, plat.prix]];
               }
               else{
                  categorie_dict[plat.specificite.titre].push([plat.denomination, plat.ingredients, plat.prix]);
               }
            }
         }

         var desserts = "Desserts";
         if( desserts in plats_dict){
            $scope.desserts = {}
            $scope.desserts[desserts] = plats_dict[desserts];
            delete plats_dict[desserts];
         }

         var brunchs_list = [];
         var brunchs = menu["brunchs"];

         if( brunchs != undefined){
            for (var i = 0; i < brunchs.length; i++) {
               var brunch = brunchs[i];
               var brunch_dict = {};
               brunch_dict["titre"] = brunch.titre;
               brunch_dict["didascalie"] = brunch.didascalie;
               brunch_dict["prix"] = brunch.prix;
               brunch_dict["items"] = [];
               brunch_dict["options"] = [];
               for(var j=0; j< brunch.items.length;j++){
                  var item = brunch.items[j];
                  if(!item.est_en_option){
                     brunch_dict["items"].push(item.plat);
                  }
                  else{
                     brunch_dict["options"].push([item.plat, item.prix_option])
                  }
               }
               brunchs_list.push(brunch_dict);
            }
            $scope.brunchs = brunchs_list;
         }

         $scope.menu = plats_dict;

      });

/*
         $scope.menu = plats;
         plats.forEach(function (plat) {
            console.log("plat : ", plat);
         });
         },function(value){
            console.error("Error in getMenu()");
         });*/


      function activate() {
         Authentication.getFullAccount(function(value){
            Authentication.fullAccount = value;
            $scope.account = value;
         });
      }
  };
})();