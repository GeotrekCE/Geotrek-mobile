'use strict';

var geotrekInit = angular.module('geotrekInit', ['leaflet-directive', 'angular-loading-bar']);

geotrekInit.config(function($stateProvider) {

    $stateProvider
    .state('preload', {
        url: '',
        templateUrl: 'views/preload.html',
        controller: 'AssetsController'
    });
}).controller('AssetsController', function ($rootScope, $scope, $state, $window, $q, treksFactory, poisFactory, staticPagesFactory, cfpLoadingBar, settings) {

    //var url = "http://rando.ecrins-parcnational.fr/fr/files/api/trek/trek.geojson";
    var url = settings.remote.TREK_REMOTE_FILE_URL;

    treksFactory.downloadTreks(url)
    .then(function() {
        return staticPagesFactory.getStaticPages();
    })
    .then(function(staticPages) {
        $rootScope.staticPages = staticPages;
        return treksFactory.getTreks();
    })
    .then(function(treks) {
        $rootScope.treks = treks;

        var trekIds = [];
        angular.forEach(treks.features, function(trek) {
            trekIds.push(trek.id);
        });

        // Downloading Trek POIs
        return poisFactory.downloadPois(trekIds);
    })
    .then(function(result) {
        cfpLoadingBar.complete();

        // Move on
        $state.go('home.trek');
    })
    .catch(function(error) {
        console.log(error);
    });

});
