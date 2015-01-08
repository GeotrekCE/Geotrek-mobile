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
            center: [settings.leaflet.GLOBAL_MAP_CENTER_LATITUDE, settings.leaflet.GLOBAL_MAP_CENTER_LONGITUDE],
            zoom: settings.leaflet.GLOBAL_MAP_DEFAULT_ZOOM,
            minZoom: settings.leaflet.GLOBAL_MAP_DEFAULT_MIN_ZOOM,
            maxZoom: settings.leaflet.GLOBAL_MAP_DEFAULT_MAX_ZOOM,
            scrollWheelZoom: true,
            zoomControl: false,
            layers: L.tileLayer(mapFactory.getGlobalTileLayerURL())
        };

        return map_parameters;
    };

    this.createMarkersFromTrek = function(trek, pois) {
        var markers = [];

        var startPoint = treksFactory.getStartPoint(trek);
        var endPoint = treksFactory.getEndPoint(trek);
        var parkingPoint = treksFactory.getParkingPoint(trek);

        markers.push(L.marker([endPoint.lat, endPoint.lng], {
            icon: iconsService.getArrivalIcon(),
            name: trek.properties.arrival,
        }));

        markers.push(L.marker([startPoint.lat, startPoint.lng], {
            icon: iconsService.getDepartureIcon(),
            name: trek.properties.departure,
        }));

        if(parkingPoint) {
            markers.push(L.marker([parkingPoint.lat, parkingPoint.lng], {
            icon: iconsService.getParkingIcon(),
            name: "Parking",
            description: trek.properties.advised_parking,
            }));
        };

        var informationCount = 0;
        angular.forEach(trek.properties.information_desks, function(information) {
            var informationDescription = "<p>" + information.description + "</p>"
                + "<p>" + information.street + "</p>"
                + "<p>" + information.postal_code + " " + information.municipality + "</p>"
                + "<p><a href='" + information.website + "'>Web</a> - <a href='tel:" + information.phone + "'>" + information.phone + "</a></p>";

            markers.push(L.marker([information.latitude, information.longitude], {
                icon: iconsService.getInformationIcon(),
                name: information.name,
                thumbnail: information.photo_url,
                description: informationDescription,
            }));
            informationCount += 1;
        });

        angular.forEach(pois, function(poi) {
            var poiCoords = {
                'lat': poi.geometry.coordinates[1],
                'lng': poi.geometry.coordinates[0]
            };
            var poiIcon = iconsService.getPOIIcon(poi);
            markers.push(L.marker([poiCoords.lat, poiCoords.lng], {
                icon: poiIcon,
                name: poi.properties.name,
                description: poi.properties.description,
                thumbnail: poi.properties.thumbnail,
                img: poi.properties.pictures[0],
                pictogram: poi.properties.type.pictogram
            }));
        });

        return markers;
    };

    this.createClusterMarkerFromTrek = function(trek) {
        var startPoint = treksFactory.getStartPoint(trek);

        var marker = L.marker([startPoint.lat, startPoint.lng], {
            icon: iconsService.getTrekIcon()
        });

        return marker;
    };

    this.setScale = function(map) {
        L.control.scale({imperial: false}).addTo(map);
    };

    this.setAttribution = function(map) {
        map.attributionControl.setPrefix(settings.leaflet.GLOBAL_MAP_ATTRIBUTION);
    };

    this.setPositionMarker = function() {

        // Pulsing marker inspired by
        // http://blog.thematicmapping.org/2014/06/real-time-tracking-with-spot-and-leafet.html
        return {
            radius: 7,
            color: 'black',
            fillColor: '#981d97',
            fillOpacity: 1,
            type: 'circleMarker',
            className: 'leaflet-live-user',
            weight: 2
        };
    }

}]);