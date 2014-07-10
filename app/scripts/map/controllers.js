'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.controller('MapController', ['$rootScope', '$state', '$scope', '$log', '$window', 'leafletData', 'filterFilter', 'settings', 'geolocationFactory', 'treksFactory', 'iconsService', 'pois', 'utils',
                                       function ($rootScope, $state, $scope, $log, $window, leafletData, filterFilter, settings, geolocationFactory, treksFactory, iconsService, pois, utils) {
    $rootScope.statename = $state.current.name;

    $scope.isAndroid = $window.ionic.Platform.isAndroid() || $window.ionic.Platform.platforms[0] === 'browser';
    $scope.isIOS = $window.ionic.Platform.isIOS();

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
                OSMTopo: {
                    name: 'OSMTopo',
                    type: 'xyz',
                    url: 'http://{s}.livembtiles.makina-corpus.net/makina/OSMTopo/{z}/{x}/{y}.png'
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
                },
                onEachFeature: function(featureData, layer) {
                    layer.on('click', function(latlng, layerPoint, containerPoint, originalEvent) {
                        utils.createModal('views/map_trek_detail.html', {isAndroid: $scope.isAndroid,
                                                                             isIOS: $scope.isIOS});
                    });
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
                layer: 'poi',
                message: '<strong>' + trek.properties.name + '</strong>',
                popupOptions: {
                    maxWidth: 150,
                    offset: [13, -50]
                }
            };
            $scope.markers['endPoint_' + trek.id] = {
                lat: endPoint.lat,
                lng: endPoint.lng,
                icon: iconsService.getArrivalIcon(),
                layer: 'poi'
            };
        });

        angular.forEach(pois, function(poi) {
            console.log(poi);
            var poiCoords = {
                'lat': poi.geometry.coordinates[1],
                'lng': poi.geometry.coordinates[0]
            };
            var poiIcon = iconsService.getPOIIcon(poi);
            $scope.markers['poi_' + poi.id] = {
                lat: poiCoords.lat,
                lng: poiCoords.lng,
                icon: poiIcon,
                layer: 'poi',
                message: poi.properties.name,
                popupOptions: {
                    offset: [0, -5]
                }
            };
        });

        leafletData.getMap().then(function(map) {
            $scope.layers.overlays['poi'].visible = (map.getZoom() > 12);
            map.on('zoomend', function() {
                $scope.layers.overlays['poi'].visible = (map.getZoom() > 12);
            });
        });
    }

    showTreks();

    $scope.$on('OnFilter', function() {
        if (angular.isDefined($scope.treks)) {
            var updateBounds = false;
            // We don't want to adapt map bounds on filter results
            showTreks(updateBounds);
        }
    });
}])
.controller('MapControllerDetail', ['$rootScope', '$state', '$scope', '$stateParams', '$window', 'treksFactory', 'leafletData', 'trek',
            function ($rootScope, $state, $scope, $stateParams, $window, treksFactory, leafletData, trek) {

    $rootScope.statename = $state.current.name;
    $scope.currentTrek = $stateParams.trekId;

    leafletData.getMap().then(function(map) {
        // Going through L.geoJson object to get trek geojson bounds
        var currentTrekBounds = L.geoJson(trek, $scope.geojson.options).getBounds();

        // FIXME: there is a leaflet bug that freeze trek display on devices
        // When fixing maxZoom to 12, we can avoid that freeze, but trek is too small
        // We need to find a way to fix it.
        var options = {};
        if (angular.isDefined($window.cordova)) {
            options['maxZoom'] = 12;
        }

        // Filling map with current trek
        map.fitBounds(currentTrekBounds, options);
    });

}]);
