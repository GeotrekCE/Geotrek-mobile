'use strict';

var geotrekPois = angular.module('geotrekPois', []);

/**
 * Service that persists and retrieves treks from data source
 */
geotrekPois.factory('poisFactory',
    ['$injector', '$window', '$rootScope', '$q', '$log', 'treksFactory', 'geolocationFactory', 'utils',
    function ($injector, $window, $rootScope, $q, $log, treksFactory, geolocationFactory, utils) {

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
    };

    poisFactory.getGeolocalizedPOIsFromTrek = function(trekId) {

        var deferred = $q.defer();

        poisFactory.getPoisFromTrek(trekId)
        .then(function(pois) {
            // Getting user geoloc to compute trek distance from user on-the-fly
            geolocationFactory.getLatLngPosition()
            .then(function(userPosition) {
                angular.forEach(pois.features, function(poi) {
                    // First coordinate is trek starting point
                    var poiPoint = {lat: poi.geometry.coordinates[1], lng: poi.geometry.coordinates[0]};
                    poi.distanceFromUser = utils.getDistanceFromLatLonInKm(userPosition.lat, userPosition.lng, poiPoint.lat, poiPoint.lng).toFixed(2);
                });
                deferred.resolve(pois);
            }, function(error) {
                $log.warn(error);
                deferred.resolve(pois);
            });
        });

        return deferred.promise;
    };

    return poisFactory;
}]);