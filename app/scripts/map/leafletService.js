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

    this.createMarkersFromTrek = function(trek, pois) {
        var markers = {};

        var startPoint = treksFactory.getStartPoint(trek);
        var endPoint = treksFactory.getEndPoint(trek);
        var parkingPoint = treksFactory.getParkingPoint(trek);

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
        markers['parking_' + trek.id] = {
            lat: parkingPoint.lat,
            lng: parkingPoint.lng,
            icon: iconsService.getParkingIcon(),
            layer: 'poi',
            name: trek.properties.advised_parking,
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

    this.setScale = function(map) {
        L.control.scale({imperial: false}).addTo(map);
    }

    this.setAttribution = function(map) {
        map.attributionControl.setPrefix(settings.leaflet.GLOBAL_MAP_ATTRIBUTION);
    }

    this.setPositionMarker = function(result) {

        // Pulsing marker inspired by
        // http://blog.thematicmapping.org/2014/06/real-time-tracking-with-spot-and-leafet.html
        return {
            radius: 5,
            color: 'orange',
            fillColor: 'black',
            fillOpacity: 1,
            latlngs: result,
            type: 'circleMarker',
            className: 'leaflet-live-user',
            strokeWidth: 10
        };
    }

}]);