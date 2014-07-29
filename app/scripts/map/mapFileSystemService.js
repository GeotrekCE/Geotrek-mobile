'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.service('mapFileSystemService',
    ['$q', '$cordovaFile', '$log', 'utils', 'settings', 'LeafletMBTileLayerService',
    function ($q, $cordovaFile, $log, utils, settings, LeafletMBTileLayerService) {

    this.downloadGlobalBackground = function(url) {
        return utils.downloadFile(url, settings.device.CDV_TILES_ROOT_FILE);
    };

    this.isReady = function() {
        var deferred = $q.defer();

        // Initialize MBTilesPlugin data types
        MBTilesPluginService.init('db', 'cdvfile', settings.device.CDV_TILES_ROOT)
        // Open MBTilesPlugin database
        .then(function(result) {
            return MBTilesPluginService.open(settings.TILES_FILE_NAME);
        })
        // Getting metadata to be sure that database is well formed
        .then(function(result) {
            return MBTilesPluginService.getMetadata();
        })
        .then(function(result) {
            deferred.resolve(result);
        })
        .catch(function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.getGlobalTileLayer = function() {
        return this.getTileLayer(settings.TILES_FILE_NAME);
    };

    this.getTileLayer = function(mbtileFilename) {

        var deferred = $q.defer(),
            mbtileFilenameWoExtension = mbtileFilename.substr(0, mbtileFilename.lastIndexOf('.'));

        LeafletMBTileLayerService.getTileLayer(mbtileFilename)
        .then(function(layer) {
            var resultDict = {
                id: mbtileFilenameWoExtension,
                name: 'MBTilesLayer-' + mbtileFilenameWoExtension,
                type: 'custom',
                layer: layer
            }
            deferred.resolve(resultDict);
        })
        .catch(function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    // Create each layer corresponding to downloaded tiles
    this.getDownloadedLayers = function() {
        var deferred = $q.defer(),
            promise = [],
            _this = this;

        $cordovaFile.listDir(settings.device.RELATIVE_TILES_ROOT)
        .then(function(listFiles) {
            var promises = [];

            angular.forEach(listFiles, function(mbtileFile) {
                if (mbtileFile.name != settings.TILES_FILE_NAME) {
                    promises.push(_this.getTileLayer(mbtileFile.name));
                }
            });

            $q.all(promises)
            .then(function(layers) {
                deferred.resolve(layers);
            })

        }, function(error) {
            $log.error(error);
            deferred.resolve([]);
        });

        return deferred.promise;
    };

    this.cleanDownloadedLayers = function() {
        var deferred = $q.defer(),
            promise = [],
            _this = this;

        $cordovaFile.listDir(settings.device.RELATIVE_TILES_ROOT)
        .then(function(listFiles) {
            var promises = [];

            angular.forEach(listFiles, function(mbtileFile) {
                if (mbtileFile.name != settings.TILES_FILE_NAME) {
                    promises.push($cordovaFile.removeFile(settings.device.RELATIVE_TILES_ROOT + "/" + mbtileFile.name));
                }
            });

            $q.all(promises)
            .then(function(layers) {
                deferred.resolve(layers);
            })

        }, function(error) {
            $log.error(error);
            deferred.resolve([]);
        });

        return deferred.promise;
    };

    this._getTrekTileFilename = function(trekId) {
        return '/trek-' + trekId.toString() + '.mbtiles';
    }

    this.downloadTrekPreciseBackground = function(trekId) {
        var url = settings.remote.TILES_REMOTE_PATH_URL + this._getTrekTileFilename(trekId);
        return utils.downloadFile(url, settings.device.CDV_TILES_ROOT + this._getTrekTileFilename(trekId));
    };

    this.hasTrekPreciseBackground = function(trekId) {
        var deferred = $q.defer();

        var trekFilenamePath = settings.device.RELATIVE_TILES_ROOT + this._getTrekTileFilename(trekId);
        $cordovaFile.checkFile(trekFilenamePath)
        .then(function(result) {
            deferred.resolve(true);
        }, function(error) {
            deferred.resolve(false);
        });

        return deferred.promise;
    };

    this.removeTrekPreciseBackground = function(trekId) {
        var trekFilenamePath = settings.device.RELATIVE_TILES_ROOT + this._getTrekTileFilename(trekId);
        return $cordovaFile.removeFile(trekFilenamePath);
    };

}]);
