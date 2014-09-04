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
        };
        utils.createModal('views/map_trek_detail.html', modalScope);
    });

    $scope.$on('leafletDirectiveMap.geojsonClick', function(event, trek) {
        var modalScope = {
            objectToDisplay: {
                name: trek.properties.name,
                description: trek.properties.description,
                duration_pretty: trek.properties.duration_pretty,
                difficulty: trek.properties.difficulty,
                ascent: trek.properties.ascent,
                length: trek.properties.length,
                id: trek.id,
                usages: trek.properties.usages
            }
        };
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
    
    // Show the scale and attribution controls
    leafletData.getMap().then(function(map) {
        leafletService.setScale(map);
        leafletService.setAttribution(map);
    });

    // Adding user current position
    geolocationFactory.getLatLngPosition()
        .then(function(result) {
            $scope.paths['userPosition'] = leafletService.setPositionMarker(result);
        }, function(error) {
            $log.warn(error);
        });

    $scope.$on('watchPosition', function(scope, position) {
        leafletData.getMap().then(function(map) {
            $scope.paths['userPosition'] = leafletService.setPositionMarker(position);
        });
    });

    // README: watchPosition has a weird issue : if we get user CurrentPosition while watch is activated
    // we get no callback for geolocation browser service
    // This callback is used to reactivate watching after getLatLngPosition call, as this call desactivate
    // watch to avoid that issue
    var watchCallback = function() {
        $rootScope.watchID = geolocationFactory.watchPosition($scope, {enableHighAccuracy: true});
    }

    // Beginning geolocation watching
    // TODO: this watch must depend on user watch setting
    watchCallback();

    // Center map on user position
    function centerMapUser() {

        // We give watchCallback on this call to reactivate watching after geolocation call
        geolocationFactory.getLatLngPosition({}, watchCallback)
        .then(function(result) {
            leafletData.getMap().then(function(map) {
                map.setView(result);
                $scope.paths['userPosition'] = leafletService.setPositionMarker(result);
            });
        })
        .catch(function(error) {
            $log.warn(error);
        });
    }

    $scope.centerMapUser = centerMapUser;

    $scope.$on('OnFilter', function() {
        var updateBounds = false;
        // We don't want to adapt map bounds on filter results
        showTreks(updateBounds);
    });

}])
.controller('MapControllerDetail', ['$rootScope', '$state', '$scope', '$stateParams', '$window', 'treksFactory', 'leafletData', 'trek',
            function ($rootScope, $state, $scope, $stateParams, $window, treksFactory, leafletData, trek) {

    $scope.currentTrek = $stateParams.trekId;

    function fitBoundsTrek(map) {
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
    }

    leafletData.getMap().then(function(map) {
        fitBoundsTrek(map);
    });

    // Center map on user position

    function centerMapTrek() {
        leafletData.getMap().then(function(map) {
            fitBoundsTrek(map);
        });
    }

    $scope.centerMapTrek = centerMapTrek;

}]);
