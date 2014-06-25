'use strict';

var geotrekInit = angular.module('geotrekInit');

geotrekInit.service('checkDataService', ['$q', '$log', 'treksFactory', 'staticPagesFactory', function($q, $log, treksFactory, staticPagesFactory) {

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
            $log.error(error);
            deferred.reject(error);
        });

        return deferred.promise;
    };
}]);
