'use strict';

/**
 * Services that persists and retrieves treks from data source
 */
angular.module('geotrekMobileServices', ['ngResource'])
    .factory('TreksData', function ($resource, $rootScope, $q) {
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
                    deferred = $q.defer();

                function getServerFile() {
                    // If currently on Cordova
                    if (angular.isDefined(navigator.network)) {

                        // Cordova property supported ? (Android/iOS/blackberry only)
                        if (angular.isDefined(navigator.network.connection.type)) {
                            var networkState = navigator.network.connection.type;

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
                    if (angular.isDefined(navigator.network)) {
                        // Cordova shit must return a file from SDCard
                    } else {
                        // Else, we're on desktop or anywhere else, download it from the build
                        return requests.query({ url: CACHED_FILE, method: 'GET' });
                    }
                }

                // First, check if we have a local file
                getLocalFile().$promise
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