'use strict';

var geotrekApp = angular.module('geotrekMobileApp', ['ngResource', 'ui.router', 'ui.bootstrap.buttons', 'geotrekMobileControllers', 'geotrekMobileServices']);

geotrekApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/trek');

    $stateProvider
    .state('trek', {
        url: '/trek',
        abstract: true,
        template: '<div ui-view></div>'
    })
    .state('trek.list', {
        url: '',
        templateUrl : 'views/trek_list.html',
        controller: 'TrekListController'
    })
    .state('trek.detail', {
        url:'/:trekId',
        templateUrl : 'views/trek_detail.html',
        controller: 'TrekController'
    })
    .state('map', {
        url:'/map',
        templateUrl : 'views/global_map.html',
        controller: 'MapController'
    })
    .state('map.trek', {
        url:'/:trekId',
        templateUrl : 'views/global_map.html',
        controller: 'MapController'
    });

});
