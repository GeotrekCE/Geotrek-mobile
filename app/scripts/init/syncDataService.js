'use strict';

var geotrekInit = angular.module('geotrekInit');


geotrekInit.service('syncDataService', ['$q', '$window', '$cordovaDialogs', '$cordovaNetwork','logging', 'settings', 'mapFactory', 'utils', 'globalizationSettings', 'treksFactory', '$translate',
    function($q, $window, $cordovaDialogs, $cordovaNetwork, logging, settings, mapFactory, utils, globalizationSettings, treksFactory, $translate) {

        this.run = function(progress) {

            var deferred = $q.defer();
            if (angular.isDefined($window.cordova)){
                if ($cordovaNetwork.isOnline()) {
                    logging.warn('GEOTREK - start downloading files');
                    utils.downloadAndUnzip(globalizationSettings.FULL_DATA_REMOTE_FILE_URL, settings.device.CDV_ROOT + "/" + settings.device.RELATIVE_ROOT, false, progress('data'))
                        .then(function(response) {
                            logging.warn('GEOTREK - response: ' + response);
                            if(!response.useCache) {
                                logging.warn('GEOTREK - refresh data');
                                return treksFactory.replaceImgURLs();
                            }
                        })
                        .then(function() {
                            logging.warn('GEOTREK - start downloading tiles');
                            return mapFactory.downloadGlobalBackground(settings.remote.MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL, progress('map'));
                        })
                        .then(function() {
                            logging.warn('GEOTREK - downloading success');
                            deferred.resolve();
                        })
                        .catch(function(error) {
                            deferred.resolve(error);
                            logging.warn('GEOTREK - error:' + error);
                            alert('L\'application a rencontré un problème lors du téléchargement des données:' + error);
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
                                            document.addEventListener('online', function () {
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
