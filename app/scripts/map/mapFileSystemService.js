'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.service('mapFileSystemService', ['$q', 'utils', 'settings', function ($q, utils, settings) {

    this.downloadGlobalBackground = function(url) {
        return utils.downloadFile(url, settings.device.CDV_TILES_ROOT_FILE);
    };

}]);
