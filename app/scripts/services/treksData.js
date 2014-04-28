'use strict';

/**
 * Services that persists and retrieves treks from data source
 */
var geotrekMobileServices = angular.module('geotrekMobileServices', ['ngResource']);

geotrekMobileServices.factory('TreksData', function ($resource) {
    var IS_ONLINE = false;
    var query = IS_ONLINE ? 'http://rando.makina-corpus.net/fr/filesapi/trek/trek.geojson' : 'trek.geojson';

    return $resource(query, {}, {
        query: { 
            isArray: true,
            cache: true,
            transformResponse: function(data) {
                data = angular.fromJson(data);
                return data.features.splice(0, 10);
            }
        }
    });
});