'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.service('mapFileSystemService', ['$q', 'utils', 'settings', 'MBTilesPluginService', function ($q, utils, settings, MBTilesPluginService) {

    this.downloadGlobalBackground = function(url) {
        return utils.downloadFile(url, settings.device.CDV_TILES_ROOT_FILE);
    };

    this.isReady = function() {
        var deferred = $q.defer();

        // Initialize MBTilesPlugin data types
        MBTilesPluginService.init('db', 'cdvfile', settings.device.CDV_TILES_ROOT)
        .then(function(result) {
            return MBTilesPluginService.getDirectoryWorking();
        })
        // Open MBTilesPlugin database
        .then(function(result) {
            return MBTilesPluginService.open(settings.TILES_FILE_NAME);
        })
        // Test some basic queries to be sure that database is well formed
        .then(function(result) {
            var query = "SELECT * FROM metadata WHERE rowid = ?1",
                params = ["1"];
            return MBTilesPluginService.executeStatement(query, params);
        })
        .then(function(result) {
            deferred.resolve(result);
        })
        .catch(function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

}]);
