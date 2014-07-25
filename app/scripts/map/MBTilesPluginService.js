'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('MBTilesPluginService', ['$q', 'settings', function ($q, settings) {

    var mbTilesPlugin = new MBTilesPlugin();

    this.init = function(type, typepath, url) {
        var deferred = $q.defer();

        mbTilesPlugin.init({type: type, typepath: typepath, url: url},
            function(result) {
                deferred.resolve(result);
            },
            function(error) {
                deferred.reject(error);
            }
        );

        return deferred.promise;
    };

    this.getDirectoryWorking = function() {
        var deferred = $q.defer();

        mbTilesPlugin.getDirectoryWorking(
            function(result) {
                deferred.resolve(result);
            },
            function(error) {
                deferred.reject(error);
            }
        );

        return deferred.promise;
    };

    this.open = function(name) {
        var deferred = $q.defer();
        
        mbTilesPlugin.open({name: name},
            function(result) {
                deferred.resolve(result);
            },
            function(error) {
                deferred.reject(error);
            }
        );

        return deferred.promise;
    };

    this.executeStatement = function(query, params) {
        var deferred = $q.defer();
        
        mbTilesPlugin.executeStatement({query: query, params: params},
            function(result) {
                deferred.resolve(result);
            },
            function(error) {
                deferred.reject(error);
            }
        );

        return deferred.promise;
    };

    this.getMinZoom = function() {
        var deferred = $q.defer();
        
        mbTilesPlugin.getMinZoom(
            function(result) {
                deferred.resolve(result);
            },
            function(error) {
                deferred.reject(error);
            }
        );

        return deferred.promise;
    };

    this.getMetadata = function() {
        var deferred = $q.defer();

        mbTilesPlugin.getMetadata(
            function(result) {
                deferred.resolve(result);
            },
            function(error) {
                deferred.reject(error);
            }
        );

        return deferred.promise;
    };

    this.getTileLayer = function() {
        var deferred = $q.defer();

        this.getMetadata()
        .then(function(metadata) {
            var tmp = new L.TileLayer.MBTilesPlugin(mbTilesPlugin,
            {
                tms: true,
                zoom: metadata.min_zoom,
                maxZoom : metadata.max_zoom,
                zoomOffset:0
            }, function(layer) {
                deferred.resolve(layer);
            });

        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    // TODO
    this.getPreciseLayers = function() {
        return [];
    };

}]);