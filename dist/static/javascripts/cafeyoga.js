!function(){"use strict";function a(a,o,e){a.defaults.xsrfHeaderName="X-CSRFToken",a.defaults.xsrfCookieName="csrftoken";var n=[];e.$on("$routeChangeSuccess",function(){n.push(o.$$path),console.log("history : ",n)}),e.back=function(){var a=n.length>1?n.splice(-2)[0]:"/";console.log("prevUrl : ",a),o.path(a)}}var o=angular.module("cafeyoga",["cafeyoga.config","cafeyoga.routes","cafeyoga.authentication","cafeyoga.yoga","cafeyoga.restaurant","cafeyoga.layout","cafeyoga.utils"]);angular.module("cafeyoga.routes",["ngRoute"]),angular.module("cafeyoga.config",[]),angular.module("cafeyoga").run(a),a.$inject=["$http","$location","$rootScope"],o.filter("isEmpty",[function(){return function(a){return angular.equals({},a)}}])}();