'use strict';

var geotrekApp = angular.module('geotrekMobileApp');

/**
 * Service that gives some utils
 *
 *
 */

geotrekApp.factory('utils', ['$q', 'settings', '$cordovaFile', '$http', 'logging', '$rootScope', '$ionicModal', function ($q, settings, $cordovaFile, $http, logging, $rootScope, $ionicModal) {

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
                        logging.info(msg);
                        deferred.resolve({message: msg, type: 'connection', data: {status: status}});
                    }
                    else {
                        // If status is different than 304, there is a connection problem

                        // We can't connect to URL
                        if (status === 0) {
                            logging.info('Network unreachable');
                            deferred.reject({message: 'Network unreachable', type: 'connection', data: {status: status}});
                        }
                        else {
                            logging.info('Response error status ' + status);
                            deferred.reject({message: 'Response error ', type: 'connection', data: {status: status}});
                        }
                    }
                    return deferred.promise;
                });

            }, function() {
                // If there is no file with that path, we download it !
                logging.info('cannot read ' + filepath + ' so downloading it at ' + url);
                return $cordovaFile.downloadFile(url, filepath);
            });
        } else {
            logging.info('forcing download of ' + filepath + ' at ' + url);
            return $cordovaFile.downloadFile(url, filepath);
        }
    };

    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    var getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
          var R = 6371; // Radius of the earth in km
          var dLat = deg2rad(lat2-lat1);  // deg2rad below
          var dLon = deg2rad(lon2-lon1);
          var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          var d = R * c; // Distance in km
          return d;
    };

    var createModal = function(template, scope) {

        angular.extend($rootScope, scope);

        $ionicModal.fromTemplateUrl(template, {
            scope: $rootScope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $rootScope.modal = modal;
            $rootScope.modal.show();
        });

        //Cleanup the modal when we're done with it!
        $rootScope.$on('$destroy', function() {
            $rootScope.modal.remove();
        });
    };

    var unzip = function(zipLocalPath, toPath) {

        var deferred = $q.defer();

        // Calling unzip method from Zip Plugin (https://github.com/MobileChromeApps/zip)
        zip.unzip(zipLocalPath, toPath, function(result) {

            if (result == 0) {
                deferred.resolve("unzip complete");
            }
            else {
                deferred.reject("unzip failed");
            }

        }, function(eventProgress) {
            // eventProgress is a dict with 2 keys : loaded and total
            deferred.notify(eventProgress);
        });

        return deferred.promise;
    };

    var downloadAndUnzip = function(url, folderPath, forceUnzip, progress) {
        var filename = url.split(/[\/]+/).pop();
        return downloadFile(url, folderPath + "/" + filename)
        .then(function(response) {
            if(response.data && response.data.status && response.data.status == 304 && !forceUnzip) {
                progress({loaded: 100, total: 100});
                var deferred = $q.defer();
                deferred.resolve({useCache: true, message: 'File already there, we assume it had been unzipped previously.'});
                return deferred.promise;
            } else {
                return unzip(folderPath + "/" + filename, folderPath);
            }
        }, null, progress);
    };


    var removeDir = function(path) {
        var defered = $q.defer();
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function gotFS(fileSystem) {
            fileSystem.root.getDirectory(path, {create: false}, function(parent) {
                parent.removeRecursively(
                    defered.resolve
                    , function() {
                        defered.reject({message: 'Directory remove error', data: path});
                    });
            }, function() {
                defered.reject({message: 'Directory not found', data: path});
            });
        }, function() {
            defered.reject({message: 'Filesystem not found', data: path});
        });
        return defered.promise;
    };

    return {
        downloadFile: downloadFile,
        getDistanceFromLatLonInKm: getDistanceFromLatLonInKm,
        createModal: createModal,
        unzip: unzip,
        downloadAndUnzip: downloadAndUnzip,
        removeDir: removeDir
    };
}]);
