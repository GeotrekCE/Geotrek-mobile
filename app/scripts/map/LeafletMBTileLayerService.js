'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('LeafletMBTileLayerService',
    ['$q', '$log', 'settings', 'MBTilesPluginService',
    function ($q, $log, settings, MBTilesPluginService) {

    this.getTileLayer = function(tileLayerFilePath) {
        var deferred = $q.defer();

        MBTilesPluginService.get(tileLayerFilePath)
        .then(function(mbTilesPlugin) {
            var tmp = new L.TileLayer.MBTilesPlugin(mbTilesPlugin,
            {
                tms: true,
                zoomOffset:0
            }, function(layer) {
                deferred.resolve(layer);
            });
        })
        .catch(function(error) {
            $log.error(error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

}]);