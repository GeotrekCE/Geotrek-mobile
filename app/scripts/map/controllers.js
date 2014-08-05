'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.controller('MapController', ['$rootScope', '$state', '$scope', '$log', '$window', 'leafletData', 'filterFilter', 'settings', 'geolocationFactory', 'treksFactory', 'iconsService', 'treks', 'utils', 'leafletService', 'leafletPathsHelpers', 'mapParameters', 'mapFactory', 'poisFactory',
                                       function ($rootScope, $state, $scope, $log, $window, leafletData, filterFilter, settings, geolocationFactory, treksFactory, iconsService, treks, utils, leafletService, leafletPathsHelpers, mapParameters, mapFactory, poisFactory) {
    $rootScope.statename = $state.current.name;
    // Initializing leaflet map
    angular.extend($scope, mapParameters);

    $scope.$on('leafletDirectiveMarker.click', function(event, args){
        var modalScope = {
            objectToDisplay: $scope.markers[args.markerName]
        }
        utils.createModal('views/map_trek_detail.html', modalScope);
    });

    $scope.$on('leafletDirectiveMap.geojsonClick', function(event, trek) {
        console.log(trek);
        var modalScope = {
            objectToDisplay: {
                name: trek.properties.name,
                description: trek.properties.description,
                duration_pretty: trek.properties.duration_pretty,
                difficulty: trek.properties.difficulty,
                ascent: trek.properties.ascent,
                length: trek.properties.length
            }
        }
        utils.createModal('views/map_trek_detail.html', modalScope);
    });

    leafletData.getMap().then(function(map) {

        mapFactory.getDownloadedLayers()
        .then(function(downloadedLayers) {

            angular.forEach(downloadedLayers, function(layerStructure) {
                map.addLayer(layerStructure.layer);
                layerStructure.layer.bringToFront();
            });
        });
    });

    // Add treks geojson to the map
    function showTreks(updateBounds) {

        // Remove all markers so the displayed markers can fit the search results
        $scope.markers = {};

        angular.extend($scope, {
            geojson: {
                data: filterFilter(treks.features, $scope.activeFilters.search),
                filter: $scope.filterTreks,
                style: {'color': '#F89406', 'weight': 5, 'opacity': 0.8},
                postLoadCallback: function(map, feature) {
                    if ((updateBounds == undefined) || (updateBounds == true)){
                        // With this call, map will always cover all geojson data area
                        map.fitBounds(feature.getBounds());
                    }
                },
                onEachFeature: function(feature, layer) {
                    // Display treks as icons and cluster them if needed
                    var cluster = leafletService.createMarkersCluster(feature);
                    angular.extend($scope.markers, cluster);
                    leafletData.getMap().then(function(map) {
                        $scope.layers.overlays['cluster'].visible = (map.getZoom() <= 10);
                        map.on('zoomend', function() {
                            $scope.layers.overlays['cluster'].visible = (map.getZoom() <= 10);
                        });
                    });

                    // Adding markers linked to current trek
                    poisFactory.getPoisFromTrek(feature.id)
                        .then(function(pois) {
                        var treksMarkers = leafletService.createMarkersFromTrek(feature, pois.features);
                        angular.extend($scope.markers, treksMarkers);
                    });

                    // Adding arrows to show trek's direction
                    layer.setText('>         ', {repeat:true, offset: 10});

                    // The version of onEachFeature from the angular-leaflet-directive is overwritten by the current onEachFeature
                    // It is therefore necessary to broadcast the event on click, as the angular-leaflet-directive does.
                    layer.on({
                        click: function(e) {
                            $rootScope.$broadcast('leafletDirectiveMap.geojsonClick', feature, e);
                        }
                    });
                }
            }
        });

        leafletData.getMap().then(function(map) {
            $scope.layers.overlays['poi'].visible = (map.getZoom() > 12);
            map.on('zoomend', function() {
                $scope.layers.overlays['poi'].visible = (map.getZoom() > 12);
            });
        });

    }

    showTreks();

    // Adding user current position
    geolocationFactory.getLatLngPosition()
        .then(function(result) {

            // Pulsing marker inspired by
            // http://blog.thematicmapping.org/2014/06/real-time-tracking-with-spot-and-leafet.html
            $scope.paths['userPosition'] = {
                radius: 5,
                color: 'orange',
                fillColor: 'black',
                fillOpacity: 1,
                latlngs: result,
                type: 'circleMarker',
                className: 'leaflet-live-user',
                strokeWidth: 10
            };

        }, function(error) {
            $log.warn(error);
        });

    $scope.$on('OnFilter', function() {
        var updateBounds = false;
        // We don't want to adapt map bounds on filter results
        showTreks(updateBounds);
    });

}])
.controller('MapControllerDetail', ['$rootScope', '$state', '$scope', '$stateParams', '$window', 'treksFactory', 'leafletData', 'trek',
            function ($rootScope, $state, $scope, $stateParams, $window, treksFactory, leafletData, trek) {

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
