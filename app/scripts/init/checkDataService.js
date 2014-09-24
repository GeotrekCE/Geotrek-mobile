'use strict';

var geotrekInit = angular.module('geotrekInit');

geotrekInit.service('checkDataService', ['$q', 'logging', 'treksFactory', 'staticPagesFactory', 'mapFactory', function($q, logging, treksFactory, staticPagesFactory, mapFactory) {

    this.isReady = function() {

        var deferred = $q.defer();

        // Checking if static pages are OK
        staticPagesFactory.getStaticPages()
        .then(function() {
            // Checking if treks are OK
            return treksFactory.getTreks();
        })
        .then(function(result) {
            deferred.resolve(result);
        })
        .catch(function(error) {
            logging.error(error);
            deferred.reject(error);
        });

        return deferred.promise;
    };
}]);
