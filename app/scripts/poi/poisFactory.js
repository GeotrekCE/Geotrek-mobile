'use strict';

var geotrekPois = angular.module('geotrekPois', []);

/**
 * Service that persists and retrieves treks from data source
 */
geotrekPois.factory('poisFactory', ['$injector', '$window', '$rootScope', '$q', 'treksFactory', function ($injector, $window, $rootScope, $q, treksFactory) {

    var poisFactory;

    if (angular.isDefined($window.cordova)) {
        poisFactory = $injector.get('poisFileSystemService');
    }
    else {
        poisFactory = $injector.get('poisRemoteService');
    }


    poisFactory.getAllPois = function() {

        return treksFactory.getTreks().then(function(treks) {
            var promises = [],
                deferred = $q.defer();

            angular.forEach(treks.features, function(trek) {
                promises.push(poisFactory.getPoisFromTrek(trek.id));
            })

            $q.all(promises).then(function(datas) {
                var pois = [];
                angular.forEach(datas, function(data) {
                    angular.forEach(data.features, function(poi) {
                        pois.push(poi);
                    })
                })
                deferred.resolve(pois);
            });

            return deferred.promise;

        });
    }

    return poisFactory;
}]);