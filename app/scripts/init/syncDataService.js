'use strict';

var geotrekInit = angular.module('geotrekInit');

geotrekInit.service('syncDataService', ['$q', '$log', 'treksFactory', 'poisFactory', function($q, $log, treksFactory, poisFactory) {

    this.run = function(url) {

        var deferred = $q.defer();

        treksFactory.downloadTreks(url)
        .then(function(result) {
            $log.info(result);
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
            $log.info(result);
            deferred.resolve(result);
        }).catch(function(error) {
            $log.warn(error);
            deferred.resolve(error);
        });

        return deferred.promise;
    };
}]);
