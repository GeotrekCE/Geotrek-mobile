'use strict';

var geotrekPois = angular.module('geotrekPois');

geotrekPois.service('poisRemoteService', function ($resource, $rootScope, $window, $q, $cordovaFile) {

    var DOMAIN_NAME = 'http://rando.makina-corpus.net',
        REMOTE_FILE_URL = DOMAIN_NAME + '/fr/files/api/trek',
        POI_FILE_NAME = 'pois.geojson';

    this.downloadPois = function(trekIds) {
        var deferred = $q.defer();
        deferred.resolve({message: 'No need to download pois in browser mode'});
        return deferred.promise;
    };

    this.replaceImgURLs = function(trekData) {
        var copy = angular.copy(trekData, {});

        // Parse trek pictures, and change their URL
        angular.forEach(copy.features, function(trek) {
            var currentTrekId = trek.id;
            trek.properties.thumbnail = DOMAIN_NAME + trek.properties.thumbnail;
            angular.forEach(trek.properties.pictures, function(picture) {
                picture.url = DOMAIN_NAME + picture.url;
            });
        });
        return copy;
    };

    this.getPoisFromTrek = function(trekId) {

        var trek_pois_url = REMOTE_FILE_URL + '/' + trekId + '/' + POI_FILE_NAME,
            requests = $resource(trek_pois_url, {}, {
                query: {
                    method: 'GET',
                    cache: true
                }
            }),
            deferred = $q.defer(),
            _this = this;

        requests.query().$promise
            .then(function(file) {
                var data = angular.fromJson(file);
                var convertedData = _this.replaceImgURLs(data);
                deferred.resolve(convertedData);
            });

        return deferred.promise;
    };
});