'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.controller('MapController', function ($scope, leafletData, filterFilter) {
    // Set default Leaflet map params
    angular.extend($scope, {
        center: {
            lat: 44.8,
            lng: 6.2,
            zoom: 9
        },
        defaults: {
            scrollWheelZoom: false,
            zoomControl: false // Not needed on Android/iOS modern devices
        }
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
})
.controller('MapControllerDetail', function ($scope, $stateParams) {
    console.log($stateParams);
});
