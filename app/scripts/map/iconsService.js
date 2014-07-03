'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('iconsService', ['$window', 'settings', function ($window, settings) {

    var iconsPrefix;

    if (angular.isDefined($window.cordova)) {
        iconsPrefix = 'images';
    }
    else {
        iconsPrefix = settings.DOMAIN_NAME + '/static/img';
    }


    var trek_icons = {
        default_icon: {},
        departure_icon: {
            iconUrl: iconsPrefix + '/marker-source.png',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            labelAnchor: [20, -50]
        },
        arrival_icon: {
            iconUrl: iconsPrefix + '/marker-target.png',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            labelAnchor: [20, -50]
        },
        poi_icon: {
            iconSize: [27, 27],
            labelAnchor: [20, -50]
        }
    };

    this.getPOIIcon = function(poi) {
        var pictogramUrl = poi.properties.type.pictogram,
            poi_icon = trek_icons.poi_icon;
        poi_icon['iconUrl'] = pictogramUrl;

        return poi_icon;
    };

    this.getDepartureIcon = function() {
        return trek_icons.departure_icon;
    };

    this.getArrivalIcon = function() {
        return trek_icons.arrival_icon;
    };

}]);