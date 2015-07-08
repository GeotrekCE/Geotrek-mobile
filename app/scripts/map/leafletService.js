'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('leafletService',
    ['$q', 'logging', 'settings', 'treksFactory', 'iconsService', 'mapFactory', '$translate',
    function ($q, logging, settings, treksFactory, iconsService, mapFactory, $translate) {

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
            layers: []
        };

        angular.forEach(mapFactory.getGlobalTileLayerURL(), function (layer) {
            map_parameters.layers.push(L.tileLayer(layer));
        });

        return map_parameters;
    };

    this.createMarkersFromTrek = function(trek, pois) {
        var deferred = $q.defer();
        var markers = [];

        var startPoint = treksFactory.getStartPoint(trek);
        var endPoint = treksFactory.getEndPoint(trek);
        var parkingPoint = treksFactory.getParkingPoint(trek);

        if (endPoint.lat === startPoint.lat && endPoint.lng === startPoint.lng) {
            markers.push(L.marker([startPoint.lat, startPoint.lng], {
                icon: iconsService.getDepartureArrivalIcon(),
                name: trek.properties.departure,
                markerType: 'departure-arrival'
            }));
        } else {
            markers.push(L.marker([endPoint.lat, endPoint.lng], {
                icon: iconsService.getArrivalIcon(),
                name: trek.properties.arrival,
                markerType: 'arrival'
            }));

            markers.push(L.marker([startPoint.lat, startPoint.lng], {
                icon: iconsService.getDepartureIcon(),
                name: trek.properties.departure,
                markerType: 'departure'
            }));
        }

        if(parkingPoint) {
            markers.push(L.marker([parkingPoint.lat, parkingPoint.lng], {
                icon: iconsService.getParkingIcon(),
                name: "Parking",
                description: trek.properties.advised_parking,
                markerType: 'parking'
            }));
        };

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
                pictogram: poi.properties.type.pictogram,
                markerType: 'poi'
            }));
        });

        $translate([
                'trek_detail.website',
                'trek_detail.email'
            ])
            .then(
                function (translations) {
                    var informationCount = 0;
                    angular.forEach(trek.properties.information_desks, function(information) {
                        if (information.latitude && information.longitude) {
                            var informationDescription = '<p>' + information.description + '</p>'
                                + '<p>' + information.street + '</p>'
                                + '<p>' + information.postal_code + ' ' + information.municipality + '</p>'
                                + '<p><a href="' + information.website + '">' + translations['trek_detail.website'] + '</a>' + ' - ' 
                                + '<a href="mailto:' + information.email + '">' + translations['trek_detail.email'] + '</a>' + ' - '
                                + '<a href="tel:' + information.phone + '">' + information.phone + '</a></p>';

                            markers.push(L.marker([information.latitude, information.longitude], {
                                icon: iconsService.getInformationIcon(),
                                name: information.name,
                                thumbnail: information.photo_url,
                                description: informationDescription,
                                markerType: 'information'
                            }));
                            informationCount += 1;
                        }
                    });
                    
                    deferred.resolve(markers);
                }
            );

        return deferred.promise;
    };

    this.createClusterMarkerFromTrek = function(trek) {
        var startPoint = treksFactory.getStartPoint(trek);

        var marker = L.marker([startPoint.lat, startPoint.lng], {
            icon: iconsService.getTrekIcon(trek)
        });

        return marker;
    };

    this.setScale = function(map) {
        L.control.scale({imperial: false}).addTo(map);
    };

    this.setAttribution = function(map) {
        map.attributionControl.setPrefix(settings.leaflet.GLOBAL_MAP_ATTRIBUTION);
    };

    this.getPositionMarker = function() {

        // Pulsing marker inspired by
        // http://blog.thematicmapping.org/2014/06/real-time-tracking-with-spot-and-leafet.html
        return L.divIcon({
            iconSize:     [24, 24], // size of the icon
            iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
            className: 'user-location-marker',
            html: '<div class="marker-background"></div><div class="marker-front"></div>'
        });
    };

}]);