'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.controller('MapController', ['$scope', '$log', 'leafletData', 'filterFilter', 'settings', 'geolocationFactory',
                                       function ($scope, $log, leafletData, filterFilter, settings, geolocationFactory) {
    // Set default Leaflet map params
    angular.extend($scope, {
        center: {
            lat: settings.leaflet.GLOBAL_MAP_CENTER_LATITUDE,
            lng: settings.leaflet.GLOBAL_MAP_CENTER_LONGITUDE,
            zoom: settings.leaflet.GLOBAL_MAP_DEFAULT_ZOOM
        },
        defaults: {
            scrollWheelZoom: true,
            zoomControl: false // Not needed on Android/iOS modern devices
        },
        markers: {}
    });

    geolocationFactory.getLatLonPosition()
        .then(function(result) {
            $scope.markers = {
                userPosition: {
                    lat: result.lat,
                    lng: result.lon,
                    message: "Vous êtes ici!"
                }
            }

        }, function(error) {
            $log.warn(error);
        });

    // Add treks geojson to the map
    function showTreks() {

        angular.extend($scope, {
            geojson: {
                data: filterFilter($scope.treks.features, $scope.activeFilters.search),
                filter: $scope.filterTreks,
                style: {
                    fillColor: 'green',
                    weight: 2,
                    opacity: 1,
                    color: 'black',
                    dashArray: '3',
                    fillOpacity: 0.7
                }
            }
        });
    }

    if (angular.isDefined($scope.treks)) { // If treks data are already loaded
        showTreks();
    } else { // Data not yet loaded, wait for loading, then display treks on map
        $scope.$on('OnTreksLoaded', showTreks);
    }

    $scope.$on('OnFilter', function() {
        if (angular.isDefined($scope.treks)) {
            showTreks();
        }
    });
}])
.controller('MapControllerDetail', ['$scope', '$stateParams', function ($scope, $stateParams) {
    console.log($stateParams);
}]);
