/*global StatusBar*/

'use strict';

var geotrekApp = angular.module('geotrekMobileApp', ['ionic', 'ngResource', 'ui.router', 'ui.bootstrap.buttons', 'geotrekMobileControllers', 'geotrekMobileServices']);

// Wait for 'deviceready' Cordova event
window.ionic.Platform.ready(function() {
    if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }

    // Now launch the app
    angular.bootstrap(document, ['geotrekMobileApp']);
});

geotrekApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/trek');

    $stateProvider
    .state('home', {
        url: '',
        abstract: true,
        templateUrl: 'views/nav_trek_map.html',
        controller: 'TrekController'
    })
    .state('home.trek', {
        url: '/trek',
        templateUrl : 'views/trek_list.html',
        controller: 'TrekListController'
    })
    .state('home.trek.detail', {
        url: '/:trekId',
        controller: 'TrekDetailController'
    })
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
