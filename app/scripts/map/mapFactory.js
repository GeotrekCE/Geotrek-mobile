'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.factory('mapFactory', ['$localStorage', '$injector', '$window', function ($localStorage, $injector, $window) {

    var mapFactory;

    if (angular.isDefined($window.cordova)) {
        mapFactory = $injector.get('mapFileSystemService');
    }
    else {
        mapFactory = $injector.get('mapRemoteService');
    }

    var LOCALSTORAGE_NEARBY_POIS = 'nearby-pois';

    mapFactory.getNearbyPois = function() {

        var nearbyPois;

        if (!$localStorage[LOCALSTORAGE_NEARBY_POIS]) {
            $localStorage[LOCALSTORAGE_NEARBY_POIS] = {};
        }

        try {
            nearbyPois = $localStorage[LOCALSTORAGE_NEARBY_POIS];
        }
        catch(e) {
        }

        return nearbyPois;
    };

    mapFactory.addNearbyPoi = function(poiId) {
        if (!$localStorage[LOCALSTORAGE_NEARBY_POIS]) {
            $localStorage[LOCALSTORAGE_NEARBY_POIS] = {};
        }
        $localStorage[LOCALSTORAGE_NEARBY_POIS][poiId] = true;
    };

    mapFactory.removeNearbyPoi = function(poiId) {
        delete $localStorage[LOCALSTORAGE_NEARBY_POIS][poiId];
    };

    return mapFactory;
}]);