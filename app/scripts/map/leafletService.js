'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('leafletService',
    ['$q', '$log', 'settings', 'treksFactory', 'iconsService', 'mapFactory',
    function ($q, $log, settings, treksFactory, iconsService, mapFactory) {

    this.getMapInitParameters = function() {
        // Set default Leaflet map params
        var map_parameters = {
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
                baselayers: {},
                overlays: {
                    poi: {
                        type: 'group',
                        name: 'poi',
                        visible: false
                    },
                    cluster: {
                        type: 'markercluster',
                        name: 'cluster',
                        visible: true
                    }
                }
            },
            markers: {},
            events: {
                markers: {
                    enable: ['click'],
                    logic: 'emit'
                }
            },
            paths: {}
        };

        var deferred = $q.defer();

        // We initialize leaflet baselayers param with :
        // 1/ Remote url on browser mode OR
        // 2/ Local saved mbtiles on device
        mapFactory.getGlobalTileLayer()
        .then(function(layer) {
            map_parameters.layers.baselayers[layer.id] = layer;
            deferred.resolve(map_parameters);
        })
        .catch(function(error) {
            $log.error(error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.createMarkersFromTrek = function(trek, pois) {
        var markers = {};

        var startPoint = treksFactory.getStartPoint(trek);
        var endPoint = treksFactory.getEndPoint(trek);

        markers['startPoint_' + trek.id] = {
            lat: startPoint.lat,
            lng: startPoint.lng,
            icon: iconsService.getDepartureIcon(),
            layer: 'poi',
            name: trek.properties.departure,
        };
        markers['endPoint_' + trek.id] = {
            lat: endPoint.lat,
            lng: endPoint.lng,
            icon: iconsService.getArrivalIcon(),
            layer: 'poi',
            name: trek.properties.arrival,
        };

        angular.forEach(pois, function(poi) {
            var poiCoords = {
                'lat': poi.geometry.coordinates[1],
                'lng': poi.geometry.coordinates[0]
            };
            var poiIcon = iconsService.getPOIIcon(poi);
            markers['poi_' + poi.id] = {
                lat: poiCoords.lat,
                lng: poiCoords.lng,
                icon: poiIcon,
                layer: 'poi',
                name: poi.properties.name,
                description: poi.properties.description,
                thumbnail: poi.properties.thumbnail,
                pictogram: poi.properties.type.pictogram
            };
        });

        return markers;
    };

    this.createMarkersCluster = function(trekData) {
        var markers = {};
        var trekIcon = iconsService.getTrekIcon();
        var middlePoint = trekData.geometry.coordinates[0];
        markers['marker' + trekData.id] = {
            icon: trekIcon,
            layer: "cluster",
            clickable: false,
            lat: middlePoint[1],
            lng: middlePoint[0],
        };

        return markers;
    };

}]);