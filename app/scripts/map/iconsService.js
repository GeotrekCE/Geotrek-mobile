'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('iconsService', ['$window', 'settings', function ($window, settings) {

    var trek_icons = {
        default_icon: {},
        departure_icon: {
            iconUrl: 'images/marker-source.png',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            labelAnchor: [20, -50]
        },
        arrival_icon: {
            iconUrl: 'images/marker-target.png',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            labelAnchor: [20, -50]
        },
        poi_icon: {
            iconSize: [27, 27],
            labelAnchor: [20, -50]
        },
        trek_icon: {
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            iconUrl: 'images/trek-icon.svg',
            className: 'trek-icon',
            labelAnchor: [15, 0]
        }
    };

    this.getPOIIcon = function(poi) {
        var pictogramUrl = poi.properties.type.pictogram,
            poiIconInstance = {};

        angular.copy(trek_icons.poi_icon, poiIconInstance);
        poiIconInstance['iconUrl'] = pictogramUrl;

        return poiIconInstance;
    };

    this.getDepartureIcon = function() {
        return trek_icons.departure_icon;
    };

    this.getArrivalIcon = function() {
        return trek_icons.arrival_icon;
    };

    this.getTrekIcon = function() {
        return trek_icons.trek_icon;
    };

}]);