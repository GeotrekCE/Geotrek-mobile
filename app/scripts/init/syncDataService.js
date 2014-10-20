'use strict';

var geotrekInit = angular.module('geotrekInit');


geotrekInit.service('syncDataService', ['$q', '$window', '$cordovaNetwork','logging', 'settings', 'mapFactory', 'utils', 'globalizationSettings', 'treksFactory',
    function($q, $window, $cordovaNetwork, logging, settings, mapFactory, utils, globalizationSettings, treksFactory) {

        this.run = function(progress) {

            var deferred = $q.defer();

            if (angular.isDefined($window.cordova) && $cordovaNetwork.isOnline()) {
                utils.downloadAndUnzip(globalizationSettings.FULL_DATA_REMOTE_FILE_URL, settings.device.CDV_ROOT + "/" + settings.device.RELATIVE_ROOT, false, progress('data'))
                .then(function(response) {
                    if(!response.useCache) {
                        return treksFactory.replaceImgURLs();
                    }
                })
                .then(function() {
                    return mapFactory.downloadGlobalBackground(settings.remote.MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL, progress('map'));
                })
                .then(function() {
                    deferred.resolve();
                })
                .catch(function(error) {
                    logging.warn(error);
                    deferred.resolve(error);
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        };
}]);
