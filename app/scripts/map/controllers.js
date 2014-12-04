'use strict';

var geotrekMap = angular.module('geotrekMap');
var map;

geotrekMap.controller('MapController', 
    ['$rootScope', '$state', '$scope', 'logging', '$window', 'leafletData', 'filterFilter', 'settings', 'geolocationFactory', 'treksFactory', 'iconsService', 'treks', 'utils', 'leafletService', 'leafletPathsHelpers', 'mapParameters', 'mapFactory', 'poisFactory', 'notificationFactory', 'userSettingsService',
    function ($rootScope, $state, $scope, logging, $window, leafletData, filterFilter, settings, geolocationFactory, treksFactory, iconsService, treks, utils, leafletService, leafletPathsHelpers, mapParameters, mapFactory, poisFactory, notificationFactory, userSettingsService) {
    $rootScope.statename = $state.current.name;

    // Initializing leaflet map
    map = L.map('map', mapParameters);
    var userPosition;
    var treks = L.geoJson();

    // Add treks geojson to the map
    function showTreks(updateBounds) {

        // Remove all markers so the displayed markers can fit the search results
        $scope.leafletService = leafletService;
        treks.clearLayers();
        treks = L.geoJson(filterFilter($rootScope.filteredTreks, $scope.activeFilters.search), {
            style: {'color': '#F89406', 'weight': 12, 'opacity': 0.8, 'smoothFactor': 3},
            onEachFeature: function(feature, layer) {
                layer.on({
                    click: function(e) {
                        $state.go("home.map.detail", { trekId: feature.properties.id });
                    }
                });
            }
        }).addTo(map).bringToBack();

        if ((updateBounds == undefined) || (updateBounds == true)){
            // With this call, map will always cover all geojson data area
            map.fitBounds(treks.getBounds());
        }
    };

    // Show the scale and attribution controls
    leafletService.setScale(map);
    leafletService.setAttribution(map);
    showTreks();

    // Adding user current position
    geolocationFactory.getLatLngPosition()
        .then(function(result) {
            userPosition = L.circleMarker(result, leafletService.setPositionMarker()).addTo(map);
        }, function(error) {
            logging.warn(error);
        });

    $scope.$on('watchPosition', function(scope, position) {
        if (position.lat && position.lng) {
            var alertOnPois;
            userSettingsService.getUserSettings().then(function(userSettings) {
                alertOnPois = userSettings.alertOnPois;
                if (alertOnPois) {
                    poisFactory.getAllPois().then(function(pois) {
                        var nearbyPois = mapFactory.getNearbyPois();
                        angular.forEach(pois, function(poi) {
                            var poiDistanceFromUser = utils.getDistanceFromLatLonInKm(position.lat, position.lng, poi.geometry.coordinates[1], poi.geometry.coordinates[0]).toFixed(2);
                            if (poiDistanceFromUser < settings.device.POI_ALERT_RADIUS) {
                                if (!nearbyPois[poi.id]) {
                                    var msg = poi.properties.name + ' (' + poiDistanceFromUser * 1000 + 'm)';
                                    notificationFactory.notify(msg);
                                    mapFactory.addNearbyPoi(poi.id);
                                }
                            } else {
                                mapFactory.removeNearbyPoi(poi.id);
                            };
                        })
                    });
                };
            });

            userPosition.setLatLng(position);
        }
    });

    // README: watchPosition has a weird issue : if we get user CurrentPosition while watch is activated
    // we get no callback for geolocation browser service
    // This callback is used to reactivate watching after getLatLngPosition call, as this call desactivate
    // watch to avoid that issue
    var watchCallback = function() {

        var watchOptions = {
            enableHighAccuracy: true
        }
        // TODO: this watch must depend on user watch setting
        $rootScope.watchID = geolocationFactory.watchPosition($scope, watchOptions);
    }

    // Beginning geolocation watching
    watchCallback();

    // Center map on user position
    function centerMapUser() {

        // We give watchCallback on this call to reactivate watching after geolocation call
        geolocationFactory.getLatLngPosition({}, watchCallback)
        .then(function(result) {
            map.setView(result);
            userPosition.setLatLng(result);
        })
        .catch(function(error) {
            logging.warn(error);
        });
    }

    $scope.centerMapUser = centerMapUser;

    $scope.$on('OnFilter', function() {
        var updateBounds = false;
        // We don't want to adapt map bounds on filter results
        showTreks(updateBounds);
    });


}])
.controller('MapControllerDetail', ['$rootScope', '$state', '$scope', '$stateParams', '$window', 'treksFactory', 'poisFactory','leafletService','leafletData', 'trek', 'utils',
            function ($rootScope, $state, $scope, $stateParams, $window, treksFactory, poisFactory, leafletService, leafletData, trek, utils) {

    $scope.currentTrek = $stateParams.trekId;

    // Draw a new polyline in background to highlight the selected trek
    var currentHighlight = L.geoJson(trek, {style:{'color': '#981d97', 'weight': 18, 'opacity': 0.8, 'smoothFactor': 3}})
        .addTo(map)
        .bringToBack()
        .setText('>         ', {repeat:true});

    var treksMarkers = L.featureGroup().addTo(map);

    function poiModal(feature) {
        var modalScope = {
            objectToDisplay: feature
        };
        utils.createModal('views/map_trek_detail.html', modalScope);
    };

    poisFactory.getPoisFromTrek(trek.id)
    .then(function(pois) {
        var pois = leafletService.createMarkersFromTrek(trek, pois.features);
        angular.forEach(pois, function(poi) {
            poi.on('click', function(e) {poiModal(e.target.options)})
            treksMarkers.addLayer(poi);
        });
    });

    // Reinitialize focus and markers of a trek
    $rootScope.$on('$stateChangeStart', function() {
        map.removeLayer(currentHighlight);
        map.removeLayer(treksMarkers);
    });

    function centerMapTrek () {
        map.fitBounds(currentHighlight);
    };

    $scope.centerMapTrek = centerMapTrek;
    
    centerMapTrek();

}]);
