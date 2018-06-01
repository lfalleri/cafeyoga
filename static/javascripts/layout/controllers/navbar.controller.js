/**
* NavbarController
* @namespace thinkster.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$scope', 'Authentication', '$location', '$window'];

  /**
  * @namespace NavbarController
  */
  function NavbarController($scope, Authentication, $location, $window) {
    var vm = this;

    $scope.account = {};
    var title = {'restaurant': 'Restaurant',
                    'yoga' : 'Yoga',
                    'boutique': 'Boutique',
                    'evenements': 'évènements',
                    'moncompte' : 'Mon compte',
                    'nosproduits' : 'Nos produits',
                    'carte' : 'Notre carte',
                    'professeurs': 'Nos professeurs',
                    'calendrier': 'Calendrier des cours'};

    var sub_items = {'restaurant': 'displayRestaurantSubItems',
                     'yoga' : 'displayYogaSubItems',
                     'boutique': 'displayBoutiqueSubItems',
                     'evenements': 'displayEvenementsSubItems',
                     'moncompte' : 'displayMonCompteSubItems'};

    $scope.displayItemList = false;
    $scope.subItems = {displayRestaurantSubItems : false,
                              displayYogaSubItems : false,
                              displayBoutiqueSubItems : false,
                              displayEvenementsSubItems : false,
                              displayMonCompteSubItems : false,};
    $scope.itemList = [ { title : 'Restaurant',
                          link: '/restaurant/nosproduits',
                          displaySubItems: false,
                          subitems : [{title: 'Nos produits',
                                      link:'/restaurant/nosproduits',
                                      subitems:[]},
                                      {title: 'Notre carte',
                                       link:'/restaurant/carte',
                                       subitems:[]},
                                      {title: 'Nos producteurs',link:'/restaurant/nosproduits',
                                       subitems:[]},
                                      {title: 'Notre carte des vins',link:'/restaurant/carte',
                                       subitems:[]}]},
                        { title : 'Yoga',
                          link: '/yoga/calendrier',
                          displaySubItems: false,
                          subitems : [{title: 'Calendrier des cours',
                                       link:'/yoga/calendrier',
                                       subitems:[]},
                                      {title: 'Nos professeurs',
                                       link:'/yoga/professeurs',
                                       subitems:[]}]},
                        { title : 'Boutique & Expo',
                          link: '/boutique',
                          displaySubItems: false,
                          subitems : []},
                        { title : 'Evènements',
                          link: '/evenements',
                          displaySubItems: false,
                          subitems : []},
                        { title : 'Mon compte',
                          link: '/settings',
                          displaySubItems: false,
                          subitems : []}];

    $scope.navBar = {'restaurant' : {title : 'Restaurant',
                                     link: '/restaurant/nosproduits',
                                     display : true,
                                     isIcon : false,
                                     displaySubItems: false,
                                     currentLocation : false,
                                     subitems : {'nosproduits':{title: 'Nos produits',
                                                                link:'/restaurant/nosproduits',
                                                                currentLocation : false,
                                                                display :true,
                                                                subitems:{}
                                                                },
                                                  'carte' : {title: 'Notre carte',
                                                             link:'/restaurant/carte',
                                                             currentLocation : false,
                                                             display :true,
                                                             subitems:{}
                                                             },
                                                  'reservation' : {title: 'Réserver',
                                                                  link:'/restaurant/reservation',
                                                                  currentLocation : false,
                                                                  display :true,
                                                                  subitems:{}
                                                                  }
                                                  }

                                     },
                       'yoga' :      {title : 'Yoga',
                                      link: '/yoga/calendrier',
                                      display : true,
                                      isIcon : false,
                                      displaySubItems: false,
                                      currentLocation : false,
                                      subitems : {'calendrier':{title: 'Calendrier des cours',
                                                                link:'/yoga/calendrier',
                                                                display :true,
                                                                subitems:{}
                                                                },
                                                  'professeurs' : {title: 'Nos professeurs',
                                                                   link:'/yoga/professeurs',
                                                                   display :true,
                                                                   subitems:{}},
                                                  'reservation':{title:'Réservation'},
                                                  'annulation':{title:'Annulation'}
                                                 }
                                      },
                       'boutique' :   {title : 'Boutique & Expo',
                                       link: '/boutique',
                                       display : true,
                                       isIcon : false,
                                       displaySubItems: false,
                                       currentLocation : false,
                                       subitems : {'createurs':{title: 'Notre boutique',
                                                                link:'/boutique/createurs',
                                                                display :true,
                                                                subitems:{}
                                                                },
                                                  'expositions' : {title: 'Nos expositions',
                                                                   link:'/boutique//expositions',
                                                                   display :true,
                                                                   subitems:{}},}
                                       },
                       'evenements' :  {title : 'Evènements',
                                        link: '/evenements',
                                        display : true,
                                        isIcon : false,
                                        displaySubItems: false,
                                        currentLocation : false,
                                        subitems : {}
                                        },
                       'settings' :    {title : 'Mon compte',
                                         link: '/settings',
                                         display : true,
                                         isIcon : false,
                                         icon : 'account_circle',
                                         displaySubItems: false,
                                         currentLocation : false,
                                         subitems : {}
                                         },
                       'logout' :       {title : 'logout',
                                         link: '',
                                         display : false,
                                         isIcon : true,
                                         icon : 'power_settings_new',
                                         displaySubItems: false,
                                         currentLocation : false,
                                         subitems : {}
                                         },
                       };


    $scope.otherLinks = {'contact' : 'Contact'};


    $scope.displaySubItems = function(item){
       var to_display = $scope.navBar[item];
       var keys = Object.keys($scope.navBar);

       keys.forEach(function(key) { //loop through keys array
          var current = $scope.navBar[key];
          if(key == item){
             current.displaySubItems = !current.displaySubItems;
           }else{
             current.displaySubItems = false;
          }
       });

       if(angular.equals(to_display.subitems, {})){
          $scope.goto(item);
       }
    }

    $scope.setCurrentLocation = function(item, subitem){ /* list : ['restaurant','nosproduits',...] for ex.*/
       if(!(item in $scope.navBar)){
           if(item in $scope.otherLinks){
              $scope.pageTitle =  $scope.otherLinks[item];
           }
       }else{
          var main = $scope.navBar[item];
          main.currentLocation = true;
          $scope.pageTitle = main.title;
          if(subitem){
             $scope.pageSubTitle = main.subitems[subitem].title;
             main.subitems[subitem].currentLocation = true;
          }
       }
    }

    $scope.getBackgroundColor = function(item){
       if(item.hasOwnProperty('displaySubItems')){ /* level 1 item */
          if(item.currentLocation){
             return {'background':'#fffdfa', 'color' : '#A87E43', 'border-bottom' : '4px solid #A87E43'};
          }
       }else{ /* level 2 item */
          if(item.currentLocation){
             return {'background':'#3e4826'};
          }
       }
    }

    $scope.getStyle = function(index, subitem){
       var offset = (index+1)*50 + 10;
       if(subitem.currentLocation){
          console.log("Current location : offset = ", offset.toString());
          return {'background':'#fffdfa', 'color' : '#3e4826', 'top': offset.toString() + 'px','border-bottom' : '2px solid #3e4826'};
       }
       console.log("Not current location : offset = ", offset.toString());
       return {'top':offset.toString()+ 'px'};
    }

    $scope.toggleMenu = function(){
       $scope.displayItemList = !$scope.displayItemList;
       $window.onclick = null;

       if ($scope.displayItemList) {
           $window.onclick = function(event) {
              var clickedElement = event.target;
              var elementClasses = clickedElement.classList;
              if (!clickedElement) return;
              var clickedOnMenuItems = elementClasses.contains('md-button') ||
                                       elementClasses.contains('menu-icon') ||
                                       (clickedElement.parentElement !== null &&
                                       clickedElement.parentElement.classList.contains('md-button'));
              if (!clickedOnMenuItems) {
                 $scope.displayItemList = !$scope.displayItemList;
                 $window.onclick = null;
                 $scope.$apply();
              }
           }

           $scope.itemList.forEach(function(i){
              i.displaySubItems = false;
           });
       } else {
          $window.onclick = null;
       }
    }

    activate();

    function activate() {
         Authentication.getFullAccount(function(value){
            $scope.account = value;
            if(!angular.equals($scope.account,{})){
               console.log("Loggé : ", $scope.account );
               $scope.navBar["logout"].display = true;
               //$scope.navBar["settings"].isIcon = true;
            }
         });

         var location = $location.path().split('/');
         console.log(location);
         //$scope.displaySubItems(location[1]);

        // $scope.pageTitle = title[location[1]];


         if(location.length > 2)
            $scope.setCurrentLocation(location[1],location[2]);
         else{
            $scope.setCurrentLocation(location[1],undefined);
         }
        //    $scope.pageSubTitle = title[location[2]];
    }

    /**
    * @name logout
    * @desc Log the user out
    * @memberOf thinkster.layout.controllers.NavbarController
    */
    $scope.logout = function(back) {
      Authentication.logout(back);
    }

    $scope.goto = function(location){
       if(location === 'logout'){
          $scope.logout(true);
       }

       var locations = {'restaurant': '/restaurant/nosproduits',
                        'yoga' : '/yoga/calendrier',
                        'createurs': '/boutique/createurs',
                        'expositions' : '/boutique/expositions',
                        'evenements': '/',
                        'settings' : '/settings',
                        'nosproduits' : '/restaurant/nosproduits',
                        'carte' : '/restaurant/carte',
                        'professeurs': '/yoga/professeurs',
                        'calendrier': '/yoga/calendrier',
                        'reservation': '/restaurant/reservation'};
       $location.url(locations[location]);
    }

    $scope.clickItem = function(item){
       if(item.subitems.length == 0 ){
          $location.url(item.link);
       }
       $scope.itemList.forEach(function(i){
           if(i===item){
              i.displaySubItems = !i.displaySubItems;
           }else{
              i.displaySubItems = false;
           }

       });
    }



  }
})();