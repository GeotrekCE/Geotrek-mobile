'use strict';

var geotrekApp = angular.module('geotrekMobileApp');

geotrekApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/trek');

    $stateProvider
    .state('home.map', {
        url: '/map',
        templateUrl : 'views/global_map.html',
        controller: 'MapController'
    })
    .state('home.map.trek', {
        url: '/:trekId',
        controller: 'MapControllerDetail'
    });
});
