'use strict';

var geotrekMap = angular.module('geotrekMap', []);

geotrekMap.config(function($stateProvider) {

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
