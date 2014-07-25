'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('MBTilesPluginService', ['$q', 'settings', function ($q, settings) {

    this.get = function(name) {
        var mbTilesPlugin = new MBTilesPlugin(),
            deferred = $q.defer();

        // Initialize MBTilesPlugin data types
        mbTilesPlugin.init({type: 'db', typepath: 'cdvfile', url: settings.device.CDV_TILES_ROOT},
            function(result) {
                // Open MBTilesPlugin database
                mbTilesPlugin.open({name: name},
                    function(result) {
                        deferred.resolve(mbTilesPlugin);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );
            },
            function(error) {
                deferred.reject(error);
            }
        );

        return deferred.promise;
    };

}]);