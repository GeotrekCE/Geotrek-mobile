'use strict';

var geotrekTreks = angular.module('geotrekTreks');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekTreks.factory('treksFactory', ['$injector', '$window', '$rootScope', '$q', '$log', 'geolocationFactory', 'utils', function ($injector, $window, $rootScope, $q, $log, geolocationFactory, utils) {

    var treksFactory;

    if (angular.isDefined($window.cordova)) {
        treksFactory = $injector.get('treksFileSystemService');
    }
    else {
        treksFactory = $injector.get('treksRemoteService');
    }

    treksFactory.getStartPoint = function(trek) {
        var firstPointCoordinates = trek.geometry.coordinates[0];

        return {'lat': firstPointCoordinates[1],
                'lng': firstPointCoordinates[0]}
    };

    treksFactory.getEndPoint = function(trek) {
        var nbPts = trek.geometry.coordinates.length;
        var lastPointCoordinates = trek.geometry.coordinates[nbPts-1];

        return {'lat': lastPointCoordinates[1],
                'lng': lastPointCoordinates[0]}
    };

    treksFactory.getGeolocalizedTreks = function() {

        return treksFactory.getTreks()
        .then(function(treks) {

            // Getting user geoloc to compute trek distance from user on-the-fly
            geolocationFactory.getLatLngPosition()
            .then(function(userPosition) {

                angular.forEach(treks.features, function(trek) {
                    // First coordinate is trek starting point
                    var startPoint = treksFactory.getStartPoint(trek);
                    trek.distanceFromUser = utils.getDistanceFromLatLonInKm(userPosition.lat, userPosition.lng, startPoint.lat, startPoint.lng).toFixed(2);
                });

            }, function(error) {
                $log.warn(error);
            });

            return treks;
        });
    };

    treksFactory.getTrek = function(_trekId) {
        var trekId = parseInt(_trekId),
            trek,
            deferred = $q.defer();

        if (angular.isDefined($rootScope.treks)) {
            angular.forEach($rootScope.treks.features, function(_trek) {
                if (_trek.id === trekId) {
                    trek = _trek;
                    return;
                }
            });
            deferred.resolve(trek);
        } else {
            treksFactory.getTreks()
            .then(function(treks) {
                angular.forEach(treks.features, function(_trek) {
                    if (_trek.id === trekId) {
                        trek = _trek;
                        return;
                    }
                });
                deferred.resolve(trek);
            });
        }

        return deferred.promise;
    };

    return treksFactory;
}]);