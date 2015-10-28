'use strict';

var geotrekTreks = angular.module('geotrekTreks');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekTreks.factory('treksFactory', ['$injector', '$window', '$rootScope', '$q', 'logging', 'geolocationFactory', 'utils', 
function ($injector, $window, $rootScope, $q, logging, geolocationFactory, utils) {

    var treksFactory;

    if (angular.isDefined($window.cordova)) {
        treksFactory = $injector.get('treksFileSystemService');
    }
    else {
        treksFactory = $injector.get('treksRemoteService');
    }

    treksFactory.getStartPoint = function(element) {
        var firstPointCoordinates = [];
        if (element.geometry.type === 'Point') {
            firstPointCoordinates = element.geometry.coordinates;
        } else if (element.geometry.type === 'LineString') {
            firstPointCoordinates = element.geometry.coordinates[0];
        } else if (element.geometry.type === 'Polygon' || element.geometry.type === 'MultiLineString') {
            firstPointCoordinates = element.geometry.coordinates[0][0];
        }

        return {
            'lat': firstPointCoordinates[1],
            'lng': firstPointCoordinates[0]
        };
    };

    treksFactory.getEndPoint = function(element) {
        var lastPointCoordinates = [];
        var lastArrayPoint;
        var nbArray;
        var nbPts;

        if (element.geometry.type === 'Point') {
            lastPointCoordinates = element.geometry.coordinates;
        } else if (element.geometry.type === 'LineString') {
            nbPts = element.geometry.coordinates.length;
            lastPointCoordinates = element.geometry.coordinates[nbPts - 1];
        } else if (element.geometry.type === 'Polygon' || element.geometry.type === 'MultiLineString') {
            nbArray = element.geometry.coordinates.length;
            lastArrayPoint = element.geometry.coordinates[nbArray - 1];
            nbPts = lastArrayPoint.length;
            lastPointCoordinates = lastArrayPoint[nbPts - 1];
        }

        return {'lat': lastPointCoordinates[1],
                'lng': lastPointCoordinates[0]};
    };

    treksFactory.getParkingPoint = function(trek) {
        var parkingCoordinates = trek.properties.parking_location;

        return parkingCoordinates ? {'lat': parkingCoordinates[1],
                'lng': parkingCoordinates[0]} : null
    };

    treksFactory.getTrekDistance = function(trek) {
        return geolocationFactory.getLatLngPosition()
        .then(function(userPosition) {
            trek.distanceFromUser = treksFactory._computeTrekDistance(trek, userPosition);
            return userPosition
        });
    };

    treksFactory.getTreksDistance = function(treks) {
        return geolocationFactory.getLatLngPosition()
        .then(function(userPosition) {
            angular.forEach(treks.features, function(trek) {
                trek.distanceFromUser = treksFactory._computeTrekDistance(trek, userPosition);
            });
        });
    };

    treksFactory._computeTrekDistance = function(trek, userPosition) {
        // First coordinate is trek starting point
        var startPoint = treksFactory.getStartPoint(trek);
        return utils.getDistanceFromLatLonInKm(userPosition.lat, userPosition.lng, startPoint.lat, startPoint.lng).toFixed(2);
    };


    treksFactory.getTrek = function(_trekId) {
        var trekId = parseInt(_trekId),
            self = this,
            trek,
            deferred = $q.defer();
            
        if (angular.isDefined($rootScope.treks)) {
            angular.forEach($rootScope.treks.features, function(_trek) {
                if (_trek.id === trekId) {
                    if (angular.isDefined($window.cordova)) {
                        trek = self.replaceGalleryURLs(_trek);
                    }else {
                        trek = _trek;
                    }
                    return;
                }
            });
            deferred.resolve(trek);
        } else {
            treksFactory.getTreks()
            .then(function(treks) {
                angular.forEach(treks.features, function(_trek) {
                    if (_trek.id === trekId) {
                        if (angular.isDefined($window.cordova)) {
                            trek = self.replaceGalleryURLs(_trek);
                        }else {
                            trek = _trek;
                        }
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