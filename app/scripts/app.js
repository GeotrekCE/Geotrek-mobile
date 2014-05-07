'use strict';

var geotrekApp = angular.module('geotrekMobileApp', ['ngResource', 'ui.router', 'ui.bootstrap.buttons', 'geotrekMobileControllers', 'geotrekMobileServices']);

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
        url:'/:trekId',
        templateUrl : 'views/trek_detail.html',
        controller: 'TrekDetailController'
    })
    .state('home.map', {
        url:'/map',
        templateUrl : 'views/global_map.html',
        controller: 'MapController'
    })
    .state('home.map.trek', {
        url:'/:trekId',
        templateUrl : 'views/global_map.html',
        controller: 'MapController'
    });

});
