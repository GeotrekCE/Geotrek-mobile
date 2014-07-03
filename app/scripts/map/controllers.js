'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.controller('MapController', ['$scope', '$log', 'leafletData', 'filterFilter', 'settings', 'geolocationFactory', 'treksFactory', 'iconsService', 'poisFactory',
                                       function ($scope, $log, leafletData, filterFilter, settings, geolocationFactory, treksFactory, iconsService, poisFactory) {
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
        layers: {
            baselayers: {
                openStreetMap: {
                name: 'OpenStreetMap',
                type: 'xyz',
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
            },
            overlays: {
                poi: {
                    type: 'group',
                    name: 'poi',
                    visible: false
                }
            }
        },
        markers: {}
    });

    geolocationFactory.getLatLonPosition()
        .then(function(result) {
            $scope.markers['userPosition'] = {
                lat: result.lat,
                lng: result.lon
            };
        }, function(error) {
            $log.warn(error);
        });

    // Add treks geojson to the map
    function showTreks(updateBounds) {
        angular.extend($scope, {
            geojson: {
                data: filterFilter($scope.treks.features, $scope.activeFilters.search),
                filter: $scope.filterTreks,
                style: {'color': '#F89406', 'weight': 5, 'opacity': 0.8},
                postLoadCallback: function(map, feature) {
                    if ((updateBounds == undefined) || (updateBounds == true)){
                        // With this call, map will always cover all geojson data area
                        map.fitBounds(feature.getBounds());
                    }
                }
            }
        });

        angular.forEach($scope.treks.features, function(trek) {

            var startPoint = treksFactory.getStartPoint(trek);
            var endPoint = treksFactory.getEndPoint(trek);

            $scope.markers['startPoint_' + trek.id] = {
                lat: startPoint.lat,
                lng: startPoint.lng,
                icon: iconsService.getDepartureIcon(),
                layer: 'poi'
            };
            $scope.markers['endPoint_' + trek.id] = {
                lat: endPoint.lat,
                lng: endPoint.lng,
                icon: iconsService.getArrivalIcon(),
                layer: 'poi'
            };

            poisFactory.getPoisFromTrek(trek.id)
            .then(function(pois) {

                angular.forEach(pois.features, function(poi) {
                    var poiCoords = {
                        'lat': poi.geometry.coordinates[1],
                        'lng': poi.geometry.coordinates[0]
                    };
                    $scope.markers['poi_' + poi.id] = {
                        lat: poiCoords.lat,
                        lng: poiCoords.lng,
                        icon: iconsService.getPOIIcon(poi),
                        layer: 'poi'
                    };
                });

                leafletData.getMap().then(function(map) {
                    $scope.layers.overlays['poi'].visible = (map.getZoom() > 12);
                    map.on('zoomend', function() {
                        $scope.layers.overlays['poi'].visible = (map.getZoom() > 12);
                    });
                });
            });
        });
    }

    if (angular.isDefined($scope.treks)) { // If treks data are already loaded
        showTreks();
    } else { // Data not yet loaded, wait for loading, then display treks on map
        $scope.$on('OnTreksLoaded', showTreks);
    }

    $scope.$on('OnFilter', function() {
        if (angular.isDefined($scope.treks)) {
            var updateBounds = false;
            // We don't want to adapt map bounds on filter results
            showTreks(updateBounds);
        }
    });
}])
.controller('MapControllerDetail', ['$scope', '$stateParams', 'treksFactory', function ($scope, $stateParams, treksFactory) {

    var trekId = $stateParams.trekId;
    $scope.currentTrek = trekId;

    treksFactory.getTrek(trekId)
    .then(function(trek) {

        // Changing filter to display only selected trek
        $scope.geojson.filter = function(trek) {
            return (trek.id == trekId);
        };

    });

}]);
