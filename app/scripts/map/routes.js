'use strict';

var geotrekMap = angular.module('geotrekMap', []);

geotrekMap.config(function($stateProvider) {

    $stateProvider
    .state('home.map', {
        url: '/map',
        templateUrl : 'views/global_map.html',
        controller: 'MapController',
        resolve: {
            pois: function(poisFactory) {
                return poisFactory.getAllPois();
            },
            mapParameters: function(leafletService) {
                return leafletService.getMapInitParameters();
            }
        }
    })
    .state('home.map.trek', {
        url: '/:trekId',
        templateUrl : 'views/detail_map.html',
        controller: 'MapControllerDetail',
        resolve: {
            trek: function($stateParams, treksFactory) {
                var trekId = $stateParams.trekId;
                return treksFactory.getTrek(trekId);
            }
        }
    });
});
