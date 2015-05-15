'use strict';

var geotrekInit = angular.module('geotrekInit');


geotrekInit.service('syncDataService', ['$q', '$window', '$cordovaDialogs', '$cordovaNetwork','logging', 'settings', 'mapFactory', 'utils', 'globalizationSettings', 'treksFactory', '$translate',
    function($q, $window, $cordovaDialogs, $cordovaNetwork, logging, settings, mapFactory, utils, globalizationSettings, treksFactory, $translate) {

        this.run = function(progress) {

            var deferred = $q.defer();
            if (angular.isDefined($window.cordova)){

                if ($cordovaNetwork.isOnline()) {

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
                }
                else {
                    utils.isFirstTime().then(function(value){
                        // if app is started for its firsttime and there is no network available.
                        if (value === true) {
                            $translate('init.error_first_loading').then(function(msg) {
                                $cordovaDialogs.alert(msg, 'Info', 'OK').then(navigator.app.exitApp);
                            });
                        }
                        // use cache
                        else {
                            deferred.resolve();
                        }
                    })
                }
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        };
}]);
