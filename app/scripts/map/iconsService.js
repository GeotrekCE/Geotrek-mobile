'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('iconsService', ['$window', 'settings', function ($window, settings) {

    var trek_icons = {
        default_icon: {},
        departure_icon: L.icon({
            iconUrl: 'images/marker-source.png',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            labelAnchor: [20, -50]
        }),
        arrival_icon: L.icon({
            iconUrl: 'images/marker-target.png',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            labelAnchor: [20, -50]
        }),
        parking_icon: L.icon({
            iconUrl: 'images/parking.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        }),
        information_icon: L.icon({
            iconUrl: 'images/information.svg',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        }),
        poi_icon: L.icon({
            iconSize: [40, 40],
            labelAnchor: [20, -50]
        })
    };

    this.getPOIIcon = function(poi) {
        //var pictogramUrl = poi.properties.type.pictogram;
        console.log(poi);
        // return L.icon({
        //     iconUrl: pictogramUrl,
        //     iconSize: [32, 32],
        //     iconAnchor: [16, 16]
        // })

        return new L.DivIcon({
            iconSize: [34, 50],
            iconAnchor: [17, 50],
            className: 'poi-icon poi-' + poi.properties.type.id
        });
    };

    this.getClusterIcon = function(cluster) {
        return new L.DivIcon({
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            className: 'trek-cluster',
            html: '<span class="count">' + cluster.getChildCount() + '</span>'
        });
    };

    this.getDepartureIcon = function() {
        return trek_icons.departure_icon;
    };

    this.getArrivalIcon = function() {
        return trek_icons.arrival_icon;
    };

    this.getParkingIcon = function() {
        return trek_icons.parking_icon;
    };

    this.getInformationIcon = function() {
        return trek_icons.information_icon;
    };

    this.getTrekIcon = function(element) {
        var icon = L.divIcon({
            iconSize: [34, 50],
            iconAnchor: [17, 50],
            className: 'trek-icon'
        });
        if (element.properties) {
            icon.options.className += ' cat-' + element.properties.category.id;
        }
        return icon;
    };

}]);