'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('leafletService', ['settings', 'treksFactory', 'iconsService', function (settings, treksFactory, iconsService) {

    this.getMapInitParameters = function() {
        // Set default Leaflet map params
        return {
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
            markers: {},
            events: {
                markers: {
                    enable: ['click'],
                    logic: 'emit'
                }
            },
            paths: {}
        }
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