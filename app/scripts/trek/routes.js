'use strict';

var geotrekTreks = angular.module('geotrekTreks', []);

geotrekTreks.config(function($stateProvider) {

    $stateProvider
    .state('home', {
        url: '',
        abstract: true,
        templateUrl: 'views/nav_trek_map.html',
        controller: 'TrekController',
        resolve: {
            treks: function(treksFactory) {
                return treksFactory.getTreks();
            },
            staticPages: function(staticPagesFactory) {
                return staticPagesFactory.getStaticPages();
            }
        }
    })
    .state('home.trek', {
        url: '/trek',
        templateUrl : 'views/trek_list.html',
        controller: 'TrekListController'
    })
    .state('home.trek.detail', {
        url: '/:trekId',
        controller: 'TrekDetailController'
    });
});
