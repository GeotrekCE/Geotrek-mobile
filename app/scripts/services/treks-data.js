'use strict';

var services = angular.module('geotrekMobileServices', ['ngResource']);

/**
 * Service that persists and retrieves treks from data source
 */
services.factory('TreksData', function ($resource, $rootScope, $window, $q) {
    var CACHED_FILE = 'trek.geojson',
        REMOTE_FILE = 'http://rando.makina-corpus.net/fr/filesapi/trek/trek.geojson';

    return {
        getTreks: function() {
            var requests = $resource(CACHED_FILE, {}, {
                    query: {
                        method: 'GET',
                        cache: true
                    }
                }),
                fs = null,
                deferred = $q.defer();

            function getServerFile() {
                // If currently on Cordova
                if (angular.isDefined($window.cordova)) {

                    // Cordova property supported ? (Android/iOS/blackberry only)
                    if (angular.isDefined($window.navigator.connection.type)) {
                        var networkState = $window.navigator.connection.type;

                        switch (networkState) {
                            case 'Connection.UNKNOWN':
                            case 'Connection.NONE':
                            case 'Connection.2G':
                                return getLocalFile();
                            default:
                                return requests.query();
                        }
                    } else {
                        // Cordova property not supported, try to get data from the server
                        return requests.query();
                    }
                } else {
                    return requests.query();
                }
            }

            function getLocalFile() {
                // If currently on Cordova
                if (angular.isDefined($window.cordova)) {
                    console.log('cordova');
                    var _deferred = $q.defer(); 
                    
                    // Cordova shit must return a file from SDCard
                    $window.requestFileSystem($window.PERSISTENT, 5*1024*1024 /*5MB*/, function(filesystem) {
                        console.log('requestFileSystem');
                        filesystem.root.getFile(CACHED_FILE, {create: false}, 
                            function(fileEntry) {
                                _deferred.resolve(fileEntry.file);
                            },
                            function() {
                                _deferred.reject('no file found');
                            }
                        );
                    }, errorHandler);

                    return _deferred.promise;
                } else {
                    // Else, we're on desktop or anywhere else, download it from the build
                    _deferred = requests.query({ url: CACHED_FILE, method: 'GET' }).$promise;

                    return _deferred;
                }
            }

            function errorHandler(e) {
              var msg = '';

              switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                  msg = 'QUOTA_EXCEEDED_ERR';
                  break;
                case FileError.NOT_FOUND_ERR:
                  msg = 'NOT_FOUND_ERR';
                  break;
                case FileError.SECURITY_ERR:
                  msg = 'SECURITY_ERR';
                  break;
                case FileError.INVALID_MODIFICATION_ERR:
                  msg = 'INVALID_MODIFICATION_ERR';
                  break;
                case FileError.INVALID_STATE_ERR:
                  msg = 'INVALID_STATE_ERR';
                  break;
                default:
                  msg = 'Unknown Error';
                  break;
              };

              console.log('Error: ' + msg);
            }

            // First, check if we have a local file
            getLocalFile()
                .then(function(file) { // Local file found!
                    console.log(file);
                    // Check if it's the last updated version
                    // checkLastVersion(file);

                    var data = angular.fromJson(file);
                    deferred.resolve(data.features.splice(0, 10));
                })
                .catch(function(error) { // No local file found
                    console.log(error);

                    getServerFile().$promise
                        .then(function(file) {
                            var data = angular.fromJson(file);
                            
                            // Save it to local
                            $window.requestFileSystem($window.PERSISTENT, 5*1024*1024 /*5MB*/, function(filesystem) {
                                console.log('requestFileSystem');
                                filesystem.root.getFile(CACHED_FILE, {create: true}, 
                                    function(fileEntry) {
                                        // Create a FileWriter object for our FileEntry (log.txt).
                                        fileEntry.createWriter(function(fileWriter) {

                                            fileWriter.onwriteend = function(e) {
                                              console.log('Write completed.');
                                            };

                                            fileWriter.onerror = function(e) {
                                              console.log('Write failed: ' + e.toString());
                                            };

                                            // Create a new Blob and write it to log.txt.
                                            var blob = new Blob(data, {type: 'text/json'});

                                            fileWriter.write(blob);

                                        }, errorHandler);
                                    },
                                    function() {
                                        _deferred.reject('no file found');
                                    }
                                );
                            }, errorHandler);

                            deferred.resolve(data.features.splice(0, 10));
                        }).catch(function(error) {
                            // Can't load local nor server file,
                            // display error message
                    });
                });

            return deferred.promise;
        },
        getTrek: function(_trekId) {
            var trekId = parseInt(_trekId);
            var trek;

            return this.getTreks().then(function(treks) {
                angular.forEach(treks, function(_trek) {
                    if (_trek.id === trekId) {
                        trek = _trek;
                        return;
                    }
                });

                return trek;
            });
        }
    };
});



/**
 * Service that gives treks filters
 */

services.value('TreksFilters', {
    difficulties : [
        { value: 1, name: 'Facile' },
        { value: 2, name: 'Moyen' },
        { value: 3, name: 'Difficile' }
    ],
    durations : [
        { value: 2.5, name: '<2H30' },
        { value: 4, name: '1/2' },
        { value: 8, name: 'Journée' }
    ],
    elevations : [
        { value: 300, name: '300m' },
        { value: 600, name: '600m' },
        { value: 1000, name: '1000m' }
    ]
});



services.service('CordovaService', function($window, $document, $q, $rootScope) {
    var d = $q.defer();

    this.ready = d.promise;

    // If currently on Cordova
    if (angular.isDefined($window.cordova)) {
        $document.addEventListener('deviceready', function() {
            d.resolve();
        });
    } else {
        d.resolve();
    }
});