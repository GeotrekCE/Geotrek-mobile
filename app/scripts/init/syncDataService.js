'use strict';

var geotrekInit = angular.module('geotrekInit');

geotrekInit.service('syncDataService', ['$q', 'logging', 'treksFactory', 'poisFactory', 'settings', 'mapFactory', 'staticPagesFactory', function($q, logging, treksFactory, poisFactory, settings, mapFactory, staticPagesFactory) {

    this.run = function() {

        var deferred = $q.defer();

        staticPagesFactory.downloadStaticPages(settings.remote.STATIC_PAGES_URL)
        .then(function(result) {
            return treksFactory.downloadTreks(settings.remote.TREK_REMOTE_FILE_URL);
        })
        .then(function(result) {
            return treksFactory.getTreks();
        })
        .then(function(treks) {
            var trekIds = [];
            angular.forEach(treks.features, function(trek) {
                trekIds.push(trek.id);
            });

            // Downloading Trek POIs
            return poisFactory.downloadPois(trekIds);
        })
        .then(function(result) {
            return mapFactory.downloadGlobalBackground(settings.remote.MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL);
        })
        .then(function(result) {
            deferred.resolve(result);
        })
        .catch(function(error) {
            logging.warn(error);
            deferred.resolve(error);
        });

        return deferred.promise;
    };
}]);
