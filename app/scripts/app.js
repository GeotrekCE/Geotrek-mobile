'use strict';

var geotrekApp = angular.module('geotrekMobileApp', ['ngRoute', 'geotrekMobileControllers']);

geotrekApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
      redirectTo: '/trek'
    }).
    when('/trek', {
      templateUrl : 'views/trek_list.html',
      controller: 'TrekListController'
    }).
    when('/map', {
      templateUrl : 'views/global_map.html',
      controller: 'MapController'
    }).
    otherwise({
        redirectTo : '/'
    });
}]);
