/**
* NavbarController
* @namespace thinkster.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.controllers')
    .controller('SideNavbarController', SideNavbarController);

  SideNavbarController.$inject = ['$scope',
                                  '$location',
                                  '$window',
                                  'Authentication',
                                   'RestaurantService',
                                  'BoutiqueService',
                                  'EvenementsService'];

  /**
  * @namespace NavbarController
  */
  function SideNavbarController($scope,
                                $location,
                                $window,
                                Authentication,
                                RestaurantService,
                                BoutiqueService,
                                EvenementsService) {

    $scope.sectionsList =
        {'restaurant' :  { title : 'Restaurant',
                           displaySubItems: false,
                           subitems : {'carte' : {title: 'Notre carte',
                                               link:'/restaurant/carte',
                                               currentLocation : false,
                                               icon:"",
                                               subitems:{}
                                               }
                                      ,
                                      'nosproduits': {title: 'Nos produits',
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
                                                      subitems:[]
                                                      }
                                      ,
                                      'recharge' : {title: 'Recharger mon compte',
                                                    link:'/yoga/recharge',
                                                    currentLocation : false,
                                                    icon:"",
                                                    subitems:[]
                                                    }
                                      }

                           }
        ,
        'boutique' :     { title : 'Boutique',
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
                           subitems : {'a venir': {title: 'A venir',
                                                  currentLocation : true,
                                                  click:function(){$scope.selectEvenementsAVenir()},
                                                  icon:"chevron_right",
                                                  subitems:{}
                                                  }
                                      ,
                                      'passes':  {title: 'Passés',
                                                  currentLocation : false,
                                                  click:function(){$scope.selectEvenementsPasses()},
                                                  icon:"",
                                                  subitems:{}
                                                  }
                                      }
                         }
        ,
        'settings' :     { title : 'Mon compte',
                           link: '/settings',
                           displaySubItems: false,
                           subitems : {'profile': {title: 'Mon profil',
                                                  currentLocation : true,
                                                  click:function(){$scope.selectUpdateProfile()},
                                                  icon:"chevron_right",
                                                  subitems:{}
                                                  }
                                       ,
                                       'lessons':{title: 'Mes cours',
                                                  currentLocation : false,
                                                  click:function(){$scope.selectLessonsHistoric()},
                                                  icon:"",
                                                  subitems:{}
                                                  }
                                       ,
                                       'historic':{title: 'Mes transactions',
                                                  currentLocation : false,
                                                  click:function(){$scope.selectTransactionsHistoric()},
                                                  icon:"",
                                                  subitems:{}
                                                  }
                                       }
                         }
        };

    activate();

    function activate() {
         var location = $location.path().split('/');
         $scope.currentSection = $scope.sectionsList[location[1]];
         $scope.currentSectionKey = location[1];

         console.log("Section : ", $scope.currentSection);
         if(location.length > 2){
            $scope.currentSubSection = $scope.currentSection.subitems[location[2]];
            console.log("SubSection : ", $scope.currentSubSection);
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
       if(subitem.currentLocation){
          return {'color' : '#54622e', 'font-weight':'700'};
       }
       else{
          return {'color' : '#A87E43', 'font-weight':'500'};
       }
    }

    $scope.selectSubSection = function(subitem){
       var target = $scope.currentSection.subitems[subitem];
       if(target.hasOwnProperty('link')){
          $scope.goto(subitem);
       }else{
          target.click();
       }

    }


    $scope.selectSubItem = function(item, key,subitem){
        if($scope.currentSectionKey === 'restaurant'){
           RestaurantService.displayText(key);
        }
        else if($scope.currentSectionKey === 'boutique'){
           BoutiqueService.displayText(key);
        }
        var section = $scope.sectionsList[$scope.currentSectionKey];
        var subSection = section.subitems[item];

        Object.keys(subSection.subitems).forEach(function(k) {
           if(k==key){
              subSection.subitems[k].currentLocation = true;
              subSection.subitems[k].icon = "chevron_right";
           }else{
              subSection.subitems[k].currentLocation = false;
              subSection.subitems[k].icon = "";
           }
        });
    }

    $scope.selectNosProducteurs = function(){
         RestaurantService.displayText('nosproducteurs');
    }

    $scope.selectNotreCharte = function(){
         RestaurantService.displayText('notrecharte');
    }

    $scope.selectExpoEnCours= function(){
         BoutiqueService.displayText('en_cours');
    }

    $scope.selectExpoPassees = function(){
         BoutiqueService.displayText('passees');
    }

    $scope.selectUpdateProfile = function(){
         $scope.currentSection.subitems['profile'].currentLocation = true;
         $scope.currentSection.subitems['profile'].icon = "chevron_right";
         $scope.currentSection.subitems['lessons'].currentLocation = false;
         $scope.currentSection.subitems['lessons'].icon = "";
         $scope.currentSection.subitems['historic'].currentLocation = false;
         $scope.currentSection.subitems['historic'].icon = "";
         Authentication.settingsDisplay('profile');
    }

    $scope.selectLessonsHistoric = function(){
         $scope.currentSection.subitems['profile'].currentLocation = false;
         $scope.currentSection.subitems['profile'].icon = "";
         $scope.currentSection.subitems['lessons'].currentLocation = true;
         $scope.currentSection.subitems['lessons'].icon = "chevron_right";
         $scope.currentSection.subitems['historic'].currentLocation = false;
         $scope.currentSection.subitems['historic'].icon = "";
         Authentication.settingsDisplay('lessons');
    }

    $scope.selectTransactionsHistoric = function(){
         $scope.currentSection.subitems['profile'].currentLocation = false;
         $scope.currentSection.subitems['profile'].icon = "";
         $scope.currentSection.subitems['lessons'].currentLocation = false;
         $scope.currentSection.subitems['lessons'].icon = "";
         $scope.currentSection.subitems['historic'].currentLocation = true;
         $scope.currentSection.subitems['historic'].icon = "chevron_right";
         Authentication.settingsDisplay('historic');
    }

    $scope.selectEvenementsAVenir = function(){
         $scope.currentSection.subitems['a venir'].currentLocation = true;
         $scope.currentSection.subitems['a venir'].icon = "chevron_right";
         $scope.currentSection.subitems['passes'].currentLocation = false;
         $scope.currentSection.subitems['passes'].icon = "";
         EvenementsService.evenementsDisplay('a venir');
    }

    $scope.selectEvenementsPasses = function(){
         $scope.currentSection.subitems['a venir'].currentLocation = false;
         $scope.currentSection.subitems['a venir'].icon = "";
         $scope.currentSection.subitems['passes'].currentLocation = true;
         $scope.currentSection.subitems['passes'].icon = "chevron_right";
         EvenementsService.evenementsDisplay('passes');
    }

    $scope.goto = function(location){
       if(location === 'logout'){
          logout(true);
       }

       var locations = {'restaurant': '/restaurant/carte',
                        'yoga' : '/yoga/calendrier',
                        'createurs': '/boutique/createurs',
                        'expositions': '/boutique/expositions',
                        'evenements': '/evenements',
                        'settings' : '/settings',
                        'nosproduits' : '/restaurant/nosproduits',
                        'carte' : '/restaurant/carte',
                        'professeurs': '/yoga/professeurs',
                        'calendrier': '/yoga/calendrier',
                        'recharge': '/yoga/recharge',
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