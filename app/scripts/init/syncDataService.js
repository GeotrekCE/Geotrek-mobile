'use strict';

var geotrekInit = angular.module('geotrekInit');


geotrekInit.service('syncDataService', ['$q', '$window', 'logging', 'settings', 'mapFactory', 'utils', 'globalizationSettings',
    function($q, $window, logging, settings, mapFactory, utils, globalizationSettings) {

        this.run = function() {

            var deferred = $q.defer();

            if (angular.isDefined($window.cordova)) {
                utils.downloadAndUnzip(globalizationSettings.FULL_DATA_REMOTE_FILE_URL, settings.device.CDV_ROOT + "/" + settings.device.RELATIVE_ROOT)
                .then(function() {
                    return mapFactory.downloadGlobalBackground(settings.remote.MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL);
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
