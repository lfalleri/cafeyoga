/**
* NavbarController
* @namespace thinkster.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.controllers')
    .controller('SideNavbarController', SideNavbarController);

  SideNavbarController.$inject = ['$scope', 'Authentication', '$location', '$window', 'RestaurantService', 'BoutiqueService'];

  /**
  * @namespace NavbarController
  */
  function SideNavbarController($scope, Authentication, $location, $window, RestaurantService, BoutiqueService) {

    $scope.sectionsList =
        {'restaurant' :  { title : 'Restaurant',
                           displaySubItems: false,
                           subitems : {'nosproduits': {title: 'Nos produits',
                                                       link:'/restaurant/nosproduits',
                                                       currentLocation : false,
                                                       icon:"",
                                                       subitems: {'nosproducteurs': {title: 'Nos producteurs',
                                                                                     click:'selectNosProducteurs()',
                                                                                     currentLocation : true,
                                                                                     icon:"chevron_right"}
                                                                  ,
                                                                  'notrecharte': {title: 'Notre charte',
                                                                                  click:'selectNotreCharte()',
                                                                                  currentLocation : false,
                                                                                  icon:""}

                                                                   }
                                                       }
                                      ,
                                      'carte' : {title: 'Notre carte',
                                               link:'/restaurant/carte',
                                               currentLocation : false,
                                               icon:"",
                                               subitems:{}
                                               }
                                      ,
                                      'reservation' : {title: 'Réserver une table',
                                                       link:'/restaurant/reservation',
                                                       currentLocation : false,
                                                       icon:"",
                                                       subitems:{}
                                                       }
                                      }
                           }
        ,
        'yoga' :         { title : 'Yoga',
                           displaySubItems: false,
                           subitems : {'calendrier' : {title: 'Calendrier des cours',
                                                      link:'/yoga/calendrier',
                                                      currentLocation : false,
                                                      icon:"",
                                                      subitems:[]
                                                      }
                                      ,
                                      'professeurs' : {title: 'Nos professeurs',
                                                      link:'/yoga/professeurs',
                                                      currentLocation : false,
                                                      icon:"",
                                                      subitems:[]}
                                      }

                           }
        ,
        'boutique' :     { title : 'Boutique & Expo',
                           displaySubItems: false,
                           subitems : {'createurs':{title: 'Notre boutique',
                                                   link:'/boutique/createurs',
                                                   currentLocation : false,
                                                   icon:"",
                                                   subitems:{}
                                                   }
                                       ,
                                       'expositions' : {title: 'Nos expositions',
                                                        link:'/boutique/expositions',
                                                        currentLocation : false,
                                                        icon:"",
                                                        subitems:{'en_cours': {title: 'Exposition en cours',
                                                                               click:'selectExpoEnCours()',
                                                                               currentLocation : true,
                                                                               icon:"chevron_right"}
                                                                  ,
                                                                  'passees': {title: 'Expositions passées',
                                                                              click:'selectExpoPassees()',
                                                                              currentLocation : false,
                                                                              icon:""}

                                                                   }
                                                        }
                                       }
                           }
        ,
        'evenements' :   { title : 'Evènements',
                           link: '/evenements',
                           displaySubItems: false,
                           subitems : []
                         }
        ,
        'settings' :     { title : 'Mon compte',
                           link: '/settings',
                           displaySubItems: false,
                           subitems : []
                         }
        };

    activate();

    function activate() {
         var location = $location.path().split('/');
         $scope.currentSection = $scope.sectionsList[location[1]];
         $scope.currentSectionKey = location[1];
         if(location.length > 2){
            $scope.currentSubSection = $scope.currentSection.subitems[location[2]];
            $scope.currentSubSection.currentLocation = true;
            $scope.currentSubSection.icon = "chevron_right";
         }
    }


    $scope.getStyle = function(item){
       if(item.currentLocation){
          return {'color' : '#54622e', 'font-weight':'700'};
       }
       else{
          return {'color' : '#A87E43', 'font-weight':'700'};
       }
    }

    $scope.getSubStyle = function(subitem){
       //console.log("getSubStyle : ", "subitem = ",subitem);
       if(subitem.currentLocation){
          return {'color' : '#54622e', 'font-weight':'700'};
       }
       else{
          return {'color' : '#A87E43', 'font-weight':'500'};
       }
    }

    $scope.selectSubSection = function(subitem){
       console.log("$scope.selectSubSection : ", subitem);
       $scope.goto(subitem);
    }


    $scope.selectSubItem = function(item, key,subitem){
        console.log("selectSubItem : ", item, "key = ", key, "subitem = ",subitem);
        if($scope.currentSectionKey === 'restaurant'){
           RestaurantService.displayText(key);
        }
        else if($scope.currentSectionKey === 'boutique'){
           BoutiqueService.displayText(key);
        }

        var section = $scope.sectionsList[$scope.currentSectionKey];
        var subSection = section.subitems[item];

        console.log("section : ", section, "\nsubSection = ", subSection);

        Object.keys(subSection.subitems).forEach(function(k) {
           console.log("k : ", k, "\nkey = ", key);
           if(k==key){
              console.log("TRUE : ", k);
              subSection.subitems[k].currentLocation = true;
              subSection.subitems[k].icon = "chevron_right";
           }else{
              console.log("FALSE : ", k);
              subSection.subitems[k].currentLocation = false;
              subSection.subitems[k].icon = "";
           }
        });
        //$scope.$apply();
        console.log("$scope.sectionsList : ", $scope.sectionsList);

    }


    $scope.selectNosProducteurs = function(){
         RestaurantService.displayText('nosproducteurs');
    }

    $scope.selectNotreCharte = function(){
         RestaurantService.displayText('notrecharte');
    }

    $scope.selectExpoEnCours= function(){
         console.log("selectExpoEnCours");
         BoutiqueService.displayText('en_cours');
    }

    $scope.selectExpoPassees = function(){
         console.log("selectExpoPassees");
         BoutiqueService.displayText('passees');
    }

    $scope.goto = function(location){
       if(location === 'logout'){
          logout(true);
       }

       var locations = {'restaurant': '/restaurant/nosproduits',
                        'yoga' : '/yoga/calendrier',
                        'createurs': '/boutique/createurs',
                        'expositions': '/boutique/expositions',
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
              i.displaySubItems = true;
           }else{
              i.displaySubItems = false;
           }

       });
    }



  }
})();