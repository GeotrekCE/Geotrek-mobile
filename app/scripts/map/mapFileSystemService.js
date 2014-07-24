'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.service('mapFileSystemService', ['$q', '$cordovaFile', 'utils', 'settings', 'MBTilesPluginService', function ($q, $cordovaFile, utils, settings, MBTilesPluginService) {

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

    this.getTileLayer = function() {
        var deferred = $q.defer();

        MBTilesPluginService.getTileLayer()
        .then(function(layer) {
            deferred.resolve({
                mbtiles: {
                    name: 'MBTilesLayer',
                    type: 'custom',
                    layer: layer
                }
            });
        })
        .catch(function(error) {
            deferred.reject(error);
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
