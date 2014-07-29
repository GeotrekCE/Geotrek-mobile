'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('LeafletMBTileLayerService',
    ['$q', '$log', 'settings',
    function ($q, $log, settings) {

    this.getTileLayer = function(tileLayerFilePath) {
        var deferred = $q.defer();

        var mbTilesPlugin = new MBTilesPlugin();

        var tmp = new L.TileLayer.MBTilesPlugin(
            mbTilesPlugin,
            tileLayerFilePath,
            settings.device.CDV_TILES_ROOT,
            { tms: true },

            function(layer) {
                deferred.resolve(layer);
            }
        );

        return deferred.promise;
    };

}]);