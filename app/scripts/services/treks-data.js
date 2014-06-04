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
        { value: 1, name: 'Facile', icon: 'difficulty-1.svg' },
        { value: 2, name: 'Moyen', icon: 'difficulty-2.svg' },
        { value: 3, name: 'Difficile', icon: 'difficulty-2.svg' },
        { value: 4, name: 'Difficile', icon: 'difficulty-2.svg' }
    ],
    durations : [
        { value: 2.5, name: '<2H30', icon: 'duration-1.svg' },
        { value: 4, name: '1/2', icon: 'duration-2.svg' },
        { value: 8, name: 'Journée', icon: 'duration-3.svg' }
    ],
    elevations : [
        { value: 300, name: '300m', icon: 'deniv1.svg' },
        { value: 600, name: '600m', icon: 'deniv1.svg' },
        { value: 1000, name: '1000m', icon: 'deniv1.svg' }
    ],
    themes : [
        { value: 'walk', name: 'Marche', icon: 'deniv1.svg' },
        { value: 'walk', name: 'Marche', icon: 'deniv1.svg' },
    ],
    communes : [
        { value: 'Pompertuzat', name: 'Pompertuzat' },
        { value: 'Pompertuzat', name: 'Pompertuzat' },
        { value: 'Pompertuzat', name: 'Pompertuzat' }
    ]
});


/**
 * Service that gives treks filters
 */

services.factory('StaticPages', function ($resource, $rootScope, $window, $q, Files) {
    return {
        getStaticPages: function() {
            var deferred = $q.defer();
            var pages = [
                { text: 'Page statique A' },
                { text: 'Page statique B' },
                { text: 'Page statique C' },
                { text: 'Page statique D' }
            ];

            deferred.resolve(pages);

            return deferred.promise;
        }
    };
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


/**
 * Cordova social sharing API
 */

services.factory('SocialSharing', function ($rootScope, $window) {
    if (!$window.cordova) {
        return;
    }

    function SocialSharing() {
    }

    // Override this method to set the location where you want the iPad popup arrow to appear.
    // If not overridden with different values, the popup is not used. Example:
    //
    //   window.plugins.socialsharing.iPadPopupCoordinates = function() {
    //     return "100,100,200,300";
    //   };
    SocialSharing.prototype.iPadPopupCoordinates = function () {
      // left,top,width,height
      return "-1,-1,-1,-1";
    };

    SocialSharing.prototype.available = function (callback) {
      cordova.exec(function (avail) {
        callback(avail ? true : false);
      }, null, "SocialSharing", "available", []);
    };

    SocialSharing.prototype.share = function (message, subject, fileOrFileArray, url, successCallback, errorCallback) {
      cordova.exec(successCallback, this._getErrorCallback(errorCallback, "share"), "SocialSharing", "share", [message, subject, this._asArray(fileOrFileArray), url]);
    };

    SocialSharing.prototype.shareViaTwitter = function (message, file /* multiple not allowed by twitter */, url, successCallback, errorCallback) {
      var fileArray = this._asArray(file);
      var ecb = this._getErrorCallback(errorCallback, "shareViaTwitter");
      if (fileArray.length > 1) {
        ecb("shareViaTwitter supports max one file");
      } else {
        cordova.exec(successCallback, ecb, "SocialSharing", "shareViaTwitter", [message, null, fileArray, url]);
      }
    };

    SocialSharing.prototype.shareViaFacebook = function (message, fileOrFileArray, url, successCallback, errorCallback) {
      cordova.exec(successCallback, this._getErrorCallback(errorCallback, "shareViaFacebook"), "SocialSharing", "shareViaFacebook", [message, null, this._asArray(fileOrFileArray), url]);
    };

    SocialSharing.prototype.shareViaWhatsApp = function (message, fileOrFileArray, url, successCallback, errorCallback) {
      cordova.exec(successCallback, this._getErrorCallback(errorCallback, "shareViaWhatsApp"), "SocialSharing", "shareViaWhatsApp", [message, null, this._asArray(fileOrFileArray), url]);
    };

    SocialSharing.prototype.shareViaSMS = function (message, phonenumbers, successCallback, errorCallback) {
      cordova.exec(successCallback, this._getErrorCallback(errorCallback, "shareViaSMS"), "SocialSharing", "shareViaSMS", [message, phonenumbers]);
    };

    SocialSharing.prototype.shareViaEmail = function (message, subject, toArray, ccArray, bccArray, fileOrFileArray, successCallback, errorCallback) {
      cordova.exec(successCallback, this._getErrorCallback(errorCallback, "shareViaEmail"), "SocialSharing", "shareViaEmail", [message, subject, this._asArray(toArray), this._asArray(ccArray), this._asArray(bccArray), this._asArray(fileOrFileArray)]);
    };

    SocialSharing.prototype.canShareVia = function (via, message, subject, fileOrFileArray, url, successCallback, errorCallback) {
      cordova.exec(successCallback, this._getErrorCallback(errorCallback, "canShareVia"), "SocialSharing", "canShareVia", [message, subject, this._asArray(fileOrFileArray), url, via]);
    };

    SocialSharing.prototype.canShareViaEmail = function (successCallback, errorCallback) {
      cordova.exec(successCallback, this._getErrorCallback(errorCallback, "canShareViaEmail"), "SocialSharing", "canShareViaEmail", []);
    };

    SocialSharing.prototype.shareVia = function (via, message, subject, fileOrFileArray, url, successCallback, errorCallback) {
      cordova.exec(successCallback, this._getErrorCallback(errorCallback, "shareVia"), "SocialSharing", "shareVia", [message, subject, this._asArray(fileOrFileArray), url, via]);
    };

    SocialSharing.prototype._asArray = function (param) {
      if (param == null) {
        param = [];
      } else if (typeof param === 'string') {
        param = new Array(param);
      }
      return param;
    };

    SocialSharing.prototype._getErrorCallback = function (ecb, functionName) {
      if (typeof ecb === 'function') {
        return ecb;
      } else {
        return function (result) {
          console.log("The injected error callback of '" + functionName + "' received: " + JSON.stringify(result));
        }
      }
    };

    SocialSharing.install = function () {
      if (!window.plugins) {
        window.plugins = {};
      }

      window.plugins.socialsharing = new SocialSharing();
      return window.plugins.socialsharing;
    };

    cordova.addConstructor(SocialSharing.install);

    return window.plugins.socialsharing;
});