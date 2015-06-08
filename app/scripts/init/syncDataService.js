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
                            console.log('download global zip');
                            return mapFactory.downloadGlobalBackground(settings.remote.MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL, progress('map'));
                        })
                        .then(function() {
                            console.log('resolve !');
                            deferred.resolve();
                        })
                        .catch(function(error) {
                            logging.warn(error);
                            deferred.resolve(error);
                        });

                } else {
                    utils.isFirstTime().then(function(firstLaunch){
                        if (!firstLaunch) {
                            // use cache
                            deferred.resolve();
                        } else {
                            $translate('init.error_first_loading').then(function(msg) {
                                $cordovaDialogs.alert(msg, 'Info', 'OK')
                                    .then(
                                        function () {
                                            console.log('Wait for Netwotk');
                                            document.addEventListener('online', function () {
                                                console.log('Netwotk found !');
                                                utils.downloadAndUnzip(globalizationSettings.FULL_DATA_REMOTE_FILE_URL, settings.device.CDV_ROOT + "/" + settings.device.RELATIVE_ROOT, false, progress('data'))
                                                    .then(function(response) {
                                                        if(!response.useCache) {
                                                            return treksFactory.replaceImgURLs();
                                                        }
                                                    })
                                                    .then(function() {
                                                        console.log('download global zip');
                                                        return mapFactory.downloadGlobalBackground(settings.remote.MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL, progress('map'));
                                                    })
                                                    .then(function() {
                                                        console.log('resolve !');
                                                        deferred.resolve();
                                                    })
                                                    .catch(function(error) {
                                                        logging.warn(error);
                                                        deferred.resolve(error);
                                                    });
                                            }, false);
                                        }
                                    );
                            });
                            
                        }
                    })
                }
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        };
}]);
