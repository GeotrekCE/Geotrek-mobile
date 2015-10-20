'use strict';

var geotrekTouristics = angular.module('geotrekTouristics', []);

/**
 * Service that persists and retrieves treks from data source
 */
geotrekTouristics.factory('touristicsFactory',
    ['$injector', '$window', '$rootScope', '$q', 'logging', 'treksFactory',
    function ($injector, $window, $rootScope, $q, logging, treksFactory) {

    var touristicsFactory;

    if (angular.isDefined($window.cordova)) {
        touristicsFactory = $injector.get('touristicsFileSystemService');
    }
    else {
        touristicsFactory = $injector.get('touristicsRemoteService');
    }


    touristicsFactory.getAllTouristicsContents = function() {

        return treksFactory.getTreks().then(function(treks) {
            var promises = [],
                deferred = $q.defer();

            angular.forEach(treks.features, function(trek) {
                promises.push(touristicsFactory.getTouristicContentsFromTrek(trek.id));
                promises.push(touristicsFactory.getTouristicEventsFromTrek(trek.id));
            });

            $q.all(promises).then(function(datas) {
                var touristics = [];
                angular.forEach(datas, function(data) {
                    angular.forEach(data.features, function(touristicContent) {
                        touristics.push(touristicContent);
                    });
                });
                deferred.resolve(touristics);
            });

            return deferred.promise;

        });
    };

    touristicsFactory.getAllTouristicsContentsFromATrek = function(trekId) {

        var promises = [],
            deferred = $q.defer();

        promises.push(touristicsFactory.getTouristicContentsFromTrek(trekId));
        promises.push(touristicsFactory.getTouristicEventsFromTrek(trekId));

        $q.all(promises).then(function(datas) {
            var touristics = [];
            angular.forEach(datas, function(data) {
                angular.forEach(data.features, function(touristicContent) {
                    touristics.push(touristicContent);
                });
            });
            deferred.resolve(touristics);
        });

        return deferred.promise;
    };

    return touristicsFactory;
}]);