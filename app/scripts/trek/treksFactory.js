'use strict';

var geotrekTreks = angular.module('geotrekTreks');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekTreks.factory('treksFactory', ['$injector', '$window', '$rootScope', '$q', 'geolocationFactory', 'utils', function ($injector, $window, $rootScope, $q, geolocationFactory, utils) {

    var treksFactory;

    if (angular.isDefined($window.cordova)) {
        treksFactory = $injector.get('treksFileSystemService');
    }
    else {
        treksFactory = $injector.get('treksRemoteService');
    }

    treksFactory.getGeolocalizedTreks = function() {

        return treksFactory.getTreks()
        .then(function(treks) {

            // Getting user geoloc to compute trek distance from user on-the-fly
            geolocationFactory.getLatLonPosition()
            .then(function(userPosition) {

                angular.forEach(treks.features, function(trek) {
                    // First coordinate is trek starting point
                    var startPoint = trek.geometry.coordinates[0];
                    trek.distanceFromUser = utils.getDistanceFromLatLonInKm(userPosition.lat, userPosition.lon, startPoint[1], startPoint[0]).toFixed(2);
                });

            }, function(error) {
                $log.warn(error);
            });

            return treks;
        });
    }

    treksFactory.getTrek = function(_trekId) {
        var trekId = parseInt(_trekId);
        var trek;

        if (angular.isDefined($rootScope.treks)) {
            var deferred = $q.defer();

            angular.forEach($rootScope.treks.features, function(_trek) {
                if (_trek.id === trekId) {
                    trek = _trek;
                    return;
                }
            });

            deferred.resolve(trek);
            return deferred.promise;
        } else {
            return treksFactory.getTreks().then(function(treks) {
                angular.forEach(treks.features, function(_trek) {
                    if (_trek.id === trekId) {
                        trek = _trek;
                        return;
                    }
                });

                return trek;
            });
        }
    };

    return treksFactory;
}]);