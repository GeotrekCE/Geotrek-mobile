'use strict';

var geotrekInit = angular.module('geotrekInit', ['geotrekGlobalization', 'geotrekMap']);

geotrekInit.config(function($stateProvider) {

    $stateProvider
    .state('preload', {
        url: '',
        templateUrl: 'views/preload.html',
        controller: 'AssetsController'
    });
}).controller('AssetsController', [ '$rootScope', '$scope', '$state', '$window', '$q', 'logging', 'treksFactory', 'staticPagesFactory', 'syncDataService', 'globalizationService', 'globalizationSettings', '$translate', 'utils',
function ($rootScope, $scope, $state, $window, $q, logging, treksFactory, staticPagesFactory, syncDataService, globalizationService, globalizationSettings, $translate, utils) {

    globalizationService.init().then(function(){
        return $translate('init.loading');
    }).then(function(msg) {
        $scope.message = msg;
    });

    utils.isFirstTime().then(function(value){
        $scope.isFirstTime = value;
    });

    $scope.progress = "0%";

    var displayProgress = function(label) {
        return function(progress) {
            if (!(label === "map" && !$scope.isFirstTime)) {
                $translate('init.' + label).then(function(msg) {
                    $scope.progress = msg + ' ' + Math.round(100 * progress.loaded/progress.total) + '%';
                });
            }
        }
    };

    var syncData = function() {
        if ((!globalizationSettings.FULL_DATA_REMOTE_FILE_URL) && (!$window.ionic.Platform.isAndroid())) {
            window.setTimeout(syncData,100);
        }else {
            // Synchronizing data with server
            syncDataService.run(displayProgress)
            .then(function() {
                // Initializing app default language
                return globalizationService.init();
            })
            .then(function(language) {
                $state.go('home.trek');
            })
            .catch(function(error) {
                logging.error(error);
                $translate('init.error_loading').then(function(msg) {
                    $scope.message = msg;
                });
            });
        }
    }

    syncData();

}]);
