'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksRemoteService', ['$resource', '$rootScope', '$window', '$q', 'Files', function ($resource, $rootScope, $window, $q, Files) {

    var CACHED_FILE = 'trek.geojson';
    //REMOTE_FILE = 'http://rando.makina-corpus.net/fr/filesapi/trek/trek.geojson';

    this.getTreks = function() {
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
            console.log('getLocalFile');

            return Files.read(CACHED_FILE);
        }

        // First, check if we have a local file
        getLocalFile()
            .then(function(results) { // Local file found!
                var file,
                    meta;
                console.log('local file found!');
                // Check if it's the last updated version
                // checkLastVersion(file);

                file = results[0];
                meta = results[1];

                var data = angular.fromJson(file);
                deferred.resolve(data);
            },
            function(error) { // No local file found
                console.log(error);

                getServerFile().$promise
                    .then(function(file) {
                        var data = angular.fromJson(file);

                        // Save it to local
                        Files.save(CACHED_FILE, angular.toJson(file)).then(function(file) {
                            console.log('saved successfully :');
                            console.log(file);
                        }, function(error) {
                            console.log('save fail :');
                            console.log(error);
                        });

                        deferred.resolve(data);
                    }).catch(function(error) {
                        // Can't load local nor server file,
                        // display error message
                });
            });

        return deferred.promise;
    };

    this.getTrek = function(_trekId) {
        var trekId = parseInt(_trekId);
        var trek;

        if (angular.isDefined($rootScope.treks)) {
            var deferred = $q.defer();

            angular.forEach($rootScope.treks.features, function(_trek) {
                if (_trek.id === trekId) {
                    trek = _trek;
                    return;
                }
            });

            deferred.resolve(trek);
            return deferred.promise;
        } else {
            return this.getTreks().then(function(treks) {
                angular.forEach(treks.features, function(_trek) {
                    if (_trek.id === trekId) {
                        trek = _trek;
                        return;
                    }
                });

                return trek;
            });
        }
    };
}]);