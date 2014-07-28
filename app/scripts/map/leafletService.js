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

    this.createMarkersFromTreks = function(treks, pois) {
        var markers = {};

        angular.forEach(treks, function(trek) {
            var startPoint = treksFactory.getStartPoint(trek);
            var endPoint = treksFactory.getEndPoint(trek);

            markers['startPoint_' + trek.id] = {
                lat: startPoint.lat,
                lng: startPoint.lng,
                icon: iconsService.getDepartureIcon(),
                layer: 'poi',
                name: trek.properties.name,
                description: trek.properties.description,
                thumbnail: trek.properties.thumbnail
            };
            markers['endPoint_' + trek.id] = {
                lat: endPoint.lat,
                lng: endPoint.lng,
                icon: iconsService.getArrivalIcon(),
                layer: 'poi',
                name: trek.properties.name,
                description: trek.properties.description
            };
        });

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

}]);