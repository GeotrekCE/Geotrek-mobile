'use strict';

var services = angular.module('geotrekMobileServices', ['ngResource']);

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


