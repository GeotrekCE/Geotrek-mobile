'use strict';

var geotrekInit = angular.module('geotrekInit', ['leaflet-directive', 'angular-loading-bar']);

geotrekInit.config(function($stateProvider) {

    $stateProvider
    .state('preload', {
        url: '',
        templateUrl: 'views/preload.html',
        controller: 'AssetsController'
    });
}).controller('AssetsController', function ($rootScope, $scope, $state, $window, $q, treksFactory, staticPagesFactory, cfpLoadingBar) {
    // Load everything in a promise
    $q.all([treksFactory.getTreks(), staticPagesFactory.getStaticPages()]).then(function(data) {
        // Save data to rootScope for later use
        console.log(data);

        $rootScope.treks = data[0];
        $rootScope.staticPages = data[1];

        cfpLoadingBar.complete();

        // Move on
        $state.go('home.trek');
    });
});
