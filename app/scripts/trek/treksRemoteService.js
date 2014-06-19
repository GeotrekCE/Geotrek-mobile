'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksRemoteService', ['$resource', '$rootScope', '$window', '$q', function ($resource, $rootScope, $window, $q) {

    //var CACHED_FILE = 'trek.geojson';
    var REMOTE_FILE = 'http://rando.makina-corpus.net/fr/filesapi/trek/trek.geojson';

    // We don't have to download Treks in Remote version, only for device offline mode
    this.downloadTreks = function() {
        return {message: 'No need to download treks in browser mode'};
    };

    this.getTreks = function() {
        var requests = $resource(REMOTE_FILE, {}, {
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

}]);