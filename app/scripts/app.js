'use strict';

var geotrekApp = angular.module('geotrekMobileApp', ['ngRoute', 'geotrekMobileControllers']);

geotrekApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl : 'views/trek_list.html',
      controller: 'TrekListController'
    }).
    when('/map', {
      templateUrl : 'views/map.html',
      controller: 'MapController'
    }).
    otherwise({
      redirectTo : '/'
    });
}]);
