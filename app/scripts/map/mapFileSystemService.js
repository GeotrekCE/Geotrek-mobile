'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.service('mapFileSystemService', ['$q', 'utils', 'settings', 'MBTilesPluginService', function ($q, utils, settings, MBTilesPluginService) {

    this.downloadGlobalBackground = function(url) {
        return utils.downloadFile(url, settings.device.CDV_TILES_ROOT_FILE);
    };

    this.testMBTilesOpening = function() {
        var _this = this;

        MBTilesPluginService.init('db', 'cdvfile', settings.device.CDV_TILES_ROOT)
        .then(function(result) {
            console.log(result);
            return MBTilesPluginService.getDirectoryWorking();
        })
        .then(function(result) {
            console.log("getDirectoryWorking : " + result.directory_working);
            return MBTilesPluginService.open(settings.TILES_FILE_NAME);
        })
        .then(function(result) {
            console.log("open : " + result);
            var query = "SELECT * FROM metadata WHERE rowid = ?1",
                params = ["1"];
            return MBTilesPluginService.executeStatement(query, params);
        })
        .then(function(result) {
            console.log("executeStatement : " + JSON.stringify(result));
            return MBTilesPluginService.getMinZoom();
        })
        .then(function(result) {
            console.log("getMinZoom --" + result + "--");
            return MBTilesPluginService.getMetadata();
        })
        .then(function(result) {
            console.log("getMetadata");
            console.log(result);
        })
        .catch(function(error) {
            $log.error(error);
        });
    };

}]);
