'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('leafletService',
    ['$q', 'logging', 'settings', 'treksFactory', 'iconsService', 'mapFactory',
    function ($q, logging, settings, treksFactory, iconsService, mapFactory) {

    var _markers = [];

    this.getMarkers = function() {
        return _markers;
    };

    this.setMarkers = function(markers) {
        _markers = markers;
    };

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
                baselayers: {
                    tiles: {
                        type: 'xyz',
                        name: 'backgroundTiles',
                        url: mapFactory.getGlobalTileLayerURL()
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
        };

        return map_parameters;
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
        if(parkingPoint) {
            markers['parking_' + trek.id] = {
                lat: parkingPoint.lat,
                lng: parkingPoint.lng,
                icon: iconsService.getParkingIcon(),
                layer: 'poi',
                name: trek.properties.advised_parking,
            };
        }
        var informationCount = 0;
        angular.forEach(trek.properties.information_desks, function(information) {
            var informationDescription = "<p>" + information.description + "</p>"
                + "<p>" + information.street + "</p>"
                + "<p>" + information.postal_code + " " + information.municipality + "</p>"
                + "<p><a href='" + information.website + "'>Web</a> - <a href='tel:" + information.phone + "'>" + information.phone + "</a></p>";
            markers['information_' + trek.id + informationCount] = {
                lat: information.latitude,
                lng: information.longitude,
                icon: iconsService.getInformationIcon(),
                layer: 'poi',
                name: information.name,
                thumbnail: information.photo_url,
                description: informationDescription,
            };
            informationCount += 1;
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
            radius: 7,
            color: 'black',
            fillColor: '#981d97',
            fillOpacity: 1,
            latlngs: result,
            type: 'circleMarker',
            className: 'leaflet-live-user',
            weight: 2
        };
    }

}]);