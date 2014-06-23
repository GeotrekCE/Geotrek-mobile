'use strict';

var geotrekApp = angular.module('geotrekMobileApp');

/**
 * Service that gives some utils
 *
 *
 */

geotrekApp.factory('utils', ['$q', 'settings', '$cordovaFile', '$http', function ($q, settings, $cordovaFile, $http) {

    var downloadFile = function(url, filepath, forceDownload) {

        if (angular.isUndefined(forceDownload)) {
            forceDownload = settings.FORCE_DOWNLOAD;
        }

        if (forceDownload === false) {

            var relativePath = filepath.replace(settings.device.CDV_ROOT + '/', '');

            return $cordovaFile.readFileMetadata(relativePath)
            .then(function(file) {

                // If there is a file, we check on server if file was modified.
                var lastModifiedDate = new Date(file.lastModifiedDate),
                    config = {
                        headers: {
                            'If-Modified-Since': lastModifiedDate.toUTCString()
                        }
                    };

                return $http.get(url, config)
                .then(function(response) {
                    // Response is 2xx
                    return $cordovaFile.downloadFile(url, filepath);

                }, function(response) {
                    var status = response.status,
                        deferred = $q.defer();

                    if (status === 304) {
                        console.log('File not changed (304) : ' + url + ' at ' + filepath);
                        deferred.resolve();
                    }
                    else {
                        console.log('Response error status ' + status);
                        deferred.reject();
                    }
                    return deferred.promise;
                });
                
            }, function() {
                console.log('cannot read ' + filepath + ' so downloading it !');
                return $cordovaFile.downloadFile(url, filepath);
            });
        } else {
            console.log('forcing download of ');
            return $cordovaFile.downloadFile(url, filepath);
        }
    };

    return {
        downloadFile: downloadFile
    };
}]);
