'use strict';

var geotrekPois = angular.module('geotrekPois');

geotrekPois.service('poisRemoteService', function ($resource, $rootScope, $window, $q, $cordovaFile) {

    var REMOTE_FILE_URL = 'http://rando.makina-corpus.net/fr/files/api/trek',
        POI_FILE_NAME = 'pois.geojson';

    this.downloadPois = function(trekIds) {
        var deferred = $q.defer();
        deferred.resolve({message: 'No need to download pois in browser mode'});
        return deferred.promise;
    };

    this.getPoisFromTrek = function(trekId) {

        var trek_pois_url = REMOTE_FILE_URL + '/' + trekId + '/' + POI_FILE_NAME;
        var requests = $resource(trek_pois_url, {}, {
                query: {
                    method: 'GET',
                    cache: true
                }
            }),
            deferred = $q.defer();

        requests.query().$promise
            .then(function(file) {
                var data = angular.fromJson(file);
                deferred.resolve(data);
            });

        return deferred.promise;
    };
});