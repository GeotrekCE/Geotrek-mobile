'use strict';

var geotrekInit = angular.module('geotrekInit', ['leaflet-directive', 'angular-loading-bar']);

geotrekInit.config(function($stateProvider) {

    $stateProvider
    .state('preload', {
        url: '',
        templateUrl: 'views/preload.html',
        controller: 'AssetsController'
    });
}).controller('AssetsController', function ($rootScope, $scope, $state, $window, $q, $log, treksFactory, staticPagesFactory, cfpLoadingBar, settings, syncDataService, checkDataService) {

    $scope.message = 'Chargement des données en cours...';

    //var url = "http://rando.ecrins-parcnational.fr/fr/files/api/trek/trek.geojson";
    var url = settings.remote.TREK_REMOTE_FILE_URL;

    cfpLoadingBar.start();

    // Synchronizing data with server
    syncDataService.run(url)
    .then(function(result) {
        // Simulating almost ended loading
        cfpLoadingBar.set(0.9);

        // Checking that data is OK before landing page redirection
        return checkDataService.isReady();
    })
    .then(function(treks) {
        cfpLoadingBar.complete();
        $state.go('home.trek');
    })
    .catch(function(error) {
        cfpLoadingBar.complete();
        $log.error(error);
        $scope.message = "Problème lors du chargement des données. Si c'est la première fois que vous utilisez Geotrek-Mobile, veuillez avoir une connexion Internet active.";
    });

});
