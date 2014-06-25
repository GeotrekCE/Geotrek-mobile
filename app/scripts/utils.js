'use strict';

var geotrekApp = angular.module('geotrekMobileApp');

/**
 * Service that gives some utils
 *
 *
 */

geotrekApp.factory('utils', ['$q', 'settings', '$cordovaFile', '$http', '$log', function ($q, settings, $cordovaFile, $http, $log) {

    var downloadFile = function(url, filepath, forceDownload) {

        if (angular.isUndefined(forceDownload)) {
            forceDownload = settings.FORCE_DOWNLOAD;
        }

        if (forceDownload === false) {

            var relativePath = filepath.replace(settings.device.CDV_ROOT + '/', '');

            return $cordovaFile.readFileMetadata(relativePath)
            .then(function(file) {

                // If there is a file, we check on server if file was modified
                // by using HTTP header 'If-Modified-Since'
                var lastModifiedDate = new Date(file.lastModifiedDate),
                    config = {
                        headers: {
                            'If-Modified-Since': lastModifiedDate.toUTCString()
                        }
                    };

                // NOTICE
                // We have used $http service because we needed 'If-Modified-Since' HTTP header,
                // and cordova plugin file transfer (used by $cordovaFile.downloadFile) doesn't manage it properly.
                // In case on 304, response body is empty, and cordova plugin overwrites previous data with empty file...
                // https://issues.apache.org/jira/browse/CB-7006

                return $http.get(url, config)
                .then(function(response) {
                    // Response is 2xx

                    // It means that server file is more recent than device one
                    // We download it so !
                    // We could have used $cordovaFile 'writeFile' function, as response contains our data,
                    // but we prefer 'downloadFile' call to be consistent with other cases.
                    return $cordovaFile.downloadFile(url, filepath);

                }, function(response) {
                    var status = response.status,
                        deferred = $q.defer();

                    if (status === 304) {
                        // If status is 304, it means that server file is older than device one
                        // Do nothing.
                        var msg = 'File not changed (304) : ' + url + ' at ' + filepath;
                        $log.info(msg);
                        deferred.resolve({message: msg, type: 'connection', data: {status: status}});
                    }
                    else {
                        // If status is different than 304, there is a connection problem

                        // We can't connect to URL
                        if (status === 0) {
                            $log.info('Network unreachable');
                            deferred.reject({message: 'Network unreachable', type: 'connection', data: {status: status}});
                        }
                        else {
                            $log.info('Response error status ' + status);
                            deferred.reject({message: 'Response error ', type: 'connection', data: {status: status}});
                        }
                    }
                    return deferred.promise;
                });

            }, function() {
                // If there is no file with that path, we download it !
                $log.info('cannot read ' + filepath + ' so downloading it !');
                return $cordovaFile.downloadFile(url, filepath);
            });
        } else {
            $log.info('forcing download of ');
            return $cordovaFile.downloadFile(url, filepath);
        }
    };

    return {
        downloadFile: downloadFile
    };
}]);
