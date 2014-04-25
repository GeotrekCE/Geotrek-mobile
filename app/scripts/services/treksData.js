'use strict';

/**
 * Services that persists and retrieves treks from data source
 */
var geotrekMobileServices = angular.module('geotrekMobileServices', ['ng']);

geotrekMobileServices.factory('TreksData', ['$http',
    function ($http) {
        var IS_ONLINE = false;

        return {
            query: function () {
                var query = IS_ONLINE ? 'http://rando.makina-corpus.net/fr/filesapi/trek/trek.geojson' : 'trek.geojson';
                return $http.get(query);
            }
        };
    }
]);