'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('leafletService', ['settings', function (settings) {

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
            }
        }
    };

}]);