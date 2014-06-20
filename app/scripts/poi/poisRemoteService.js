'use strict';

var geotrekPois = angular.module('geotrekPois');

geotrekPois.service('poisRemoteService', function ($resource, $rootScope, $window, $q, $cordovaFile, settings) {

    this.downloadPois = function(trekIds) {
        var deferred = $q.defer();
        deferred.resolve({message: 'No need to download pois in browser mode'});
        return deferred.promise;
    };

    this.replaceImgURLs = function(poiData) {
        var copy = angular.copy(poiData, {});

        // Parse trek pictures, and change their URL
        angular.forEach(copy.features, function(poi) {
            poi.properties.thumbnail = settings.DOMAIN_NAME + poi.properties.thumbnail;
            angular.forEach(poi.properties.pictures, function(picture) {
                picture.url = settings.DOMAIN_NAME + picture.url;
            });
        });
        return copy;
    };

    this.getPoisFromTrek = function(trekId) {

        var trek_pois_url = settings.remote.TREK_REMOTE_FILE_URL_BASE + '/' + trekId + '/' + settings.POI_FILE_NAME,
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