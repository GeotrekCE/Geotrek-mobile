'use strict';

var geotrekInit = angular.module('geotrekInit', ['leaflet-directive', 'angular-loading-bar', 'geotrekGlobalization', 'geotrekMap']);

geotrekInit.config(function($stateProvider) {

    $stateProvider
    .state('preload', {
        url: '',
        templateUrl: 'views/preload.html',
        controller: 'AssetsController'
    });
}).controller('AssetsController', function ($rootScope, $scope, $state, $window, $q, logging, treksFactory, staticPagesFactory, cfpLoadingBar, syncDataService, globalizationService, $translate) {

    $translate('init.loading').then(function(msg) {
        $scope.message = msg;
    });

    cfpLoadingBar.start();
    $scope.progress = "0%";

    var displayProgress = function(label) {
        return function(progress) {
            $scope.progress = label + ' ' + Math.round(100 * progress.loaded/progress.total) + '%';
        }
    };

    // Synchronizing data with server
    syncDataService.run(displayProgress)
    .then(function() {
        // Initializing app default language
        return globalizationService.init();
    })
    .then(function(language) {
        cfpLoadingBar.complete();
        $state.go('home.trek');
    })
    .catch(function(error) {
        cfpLoadingBar.complete();
        logging.error(error);
        $translate('init.error_loading').then(function(msg) {
            $scope.message = msg;
        });
    });

});
