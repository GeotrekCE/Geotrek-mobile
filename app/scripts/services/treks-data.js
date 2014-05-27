'use strict';

var services = angular.module('geotrekMobileServices', ['ngResource']);

/**
 * Service that persists and retrieves treks from data source
 */
services.factory('TreksData', function ($resource, $rootScope, $window, $q, Files) {
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
        },
        getTrek: function(_trekId) {
            var trekId = parseInt(_trekId);
            var trek;

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
});



/**
 * Service that gives treks filters
 */

services.value('TreksFilters', {
    difficulties : [
        { value: 1, name: 'Facile', icon: 'icon-geotrek-difficulty1' },
        { value: 2, name: 'Moyen', icon: 'icon-geotrek-difficulty2' },
        { value: 3, name: 'Difficile', icon: 'icon-geotrek-difficulty2' }
    ],
    durations : [
        { value: 2.5, name: '<2H30', icon: 'icon-geotrek-difficulty2' },
        { value: 4, name: '1/2', icon: 'icon-geotrek-difficulty2' },
        { value: 8, name: 'Journée', icon: 'icon-geotrek-difficulty2' }
    ],
    elevations : [
        { value: 300, name: '300m', icon: 'icon-geotrek-level1' },
        { value: 600, name: '600m', icon: 'icon-geotrek-level1' },
        { value: 1000, name: '1000m', icon: 'icon-geotrek-level1' }
    ]
});



/**
 * Cordova File API Service
 */

services.service('WebFiles', function ($window, $q, $resource) {
    var requests = $resource(':url', {}, {
            query: {
                method: 'GET',
                cache: true
            }
        });

    this.save = function(filename, content) {
        var defered = $q.defer();
        defered.resolve(true);
        return defered.promise;
    };

    this.read = function(filename) {
        return $q.all([requests.query({ url: filename, method: 'GET' }).$promise, '2014-05-12T13:51:58.000Z']);
    };

    this.remove = function(filename) {
        var defered = $q.defer();
        defered.resolve(true);
        return defered.promise;
    };
});

services.service('CordovaFiles', function ($window, $q) {
    var fstype = $window.PERSISTENT;
    var path_prefix = 'geotrek/';

    $window.requestFileSystem(fstype, 0, function gotFS(fileSystem) {
        var dataDir = fileSystem.root.getDirectory(path_prefix, {create: true});
    }, function() {
        throw 'cannot-create-root-directory';
    });

    this.save = function(filename, content) {
        var defered = $q.defer();
        window.requestFileSystem(fstype, 0, function gotFS(fileSystem) {
            fileSystem.root.getFile(
                path_prefix + filename,
                {create: true, exclusive: false},
                function gotFileEntry(fileEntry) {
                    fileEntry.createWriter(function gotFileWriter(writer) {
                        writer.onwriteend = defered.resolve;
                        writer.write(content);
                    }, defered.reject);
                }, defered.reject);
        }, defered.reject);
        return defered.promise;
    };

    this.read = function(filename) {
        var deferedFile = $q.defer(),
            deferedMeta = $q.defer();
        $window.requestFileSystem(fstype, 0, function gotFS(fileSystem) {
            fileSystem.root.getFile(path_prefix + filename,
                null, function gotFileEntry(fileEntry) {
                fileEntry.file(function gotFile(file){
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        deferedFile.resolve(evt.target.result);
                    };
                    reader.readAsText(file);
                }, deferedFile.reject);

                fileEntry.getMetadata(function gotMetadata(metadata) {
                    deferedMeta.resolve(metadata);
                }, deferedMeta.reject);
            }, deferedFile.reject);
        }, deferedFile.reject);
        return $q.all([deferedFile.promise, deferedMeta.promise]);
    };

    this.remove = function(filename) {
        var defered = $q.defer();
        $window.requestFileSystem(fstype, 0, function gotFS(fileSystem) {
            fileSystem.root.getFile(path_prefix + filename,
                null, function gotFileEntry(fileEntry) {
                fileEntry.remove(defered.resolve, defered.reject);
            }, defered.reject);
        }, defered.reject);
        return defered.promise;
    };
});

services.factory('Files', function($window, $injector) {
    if ($window.cordova) {
        return $injector.get('CordovaFiles');
    } else {
        return $injector.get('WebFiles');
    }
});