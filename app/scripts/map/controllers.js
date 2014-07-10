'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.controller('MapController', ['$rootScope', '$state', '$scope', '$log', '$window', 'leafletData', 'filterFilter', 'settings', 'geolocationFactory', 'treksFactory', 'iconsService', 'treks', 'pois', 'utils', 'leafletService',
                                       function ($rootScope, $state, $scope, $log, $window, leafletData, filterFilter, settings, geolocationFactory, treksFactory, iconsService, treks, pois, utils, leafletService) {
    $rootScope.statename = $state.current.name;

    // Initializing leaflet map
    angular.extend($scope, leafletService.getMapInitParameters());

    // Adding markers linked to current trek
    var treksMarkers = leafletService.createMarkersFromTreks(treks.features, pois);
    angular.extend($scope.markers, treksMarkers);

    $scope.$on('leafletDirectiveMarker.click', function(event, args){
        var currentMarker = $scope.markers[args.markerName];
        utils.createModal('views/map_trek_detail.html',
            {isAndroid: $scope.isAndroid, isIOS: $scope.isIOS});
    });

    // Add treks geojson to the map
    function showTreks(updateBounds) {

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
                onEachFeature: function(featureData, layer) {
                    layer.on('click', function(latlng, layerPoint, containerPoint, originalEvent) {
                        utils.createModal('views/map_trek_detail.html', {isAndroid: $scope.isAndroid,
                                                                             isIOS: $scope.isIOS});
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
    geolocationFactory.getLatLonPosition()
        .then(function(result) {
            $scope.markers['userPosition'] = {
                lat: result.lat,
                lng: result.lon
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
