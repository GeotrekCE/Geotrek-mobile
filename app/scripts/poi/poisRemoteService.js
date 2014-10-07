'use strict';

var geotrekPois = angular.module('geotrekPois');

geotrekPois.service('poisRemoteService', function ($resource, $rootScope, $window, $q, $cordovaFile, settings, globalizationSettings) {

    this.convertServerUrlToRemoteUrl = function(serverUrl) {
        return settings.DOMAIN_NAME + serverUrl;
    };

    this.replaceImgURLs = function(poiData) {
        var copy = angular.copy(poiData, {}),
            _this = this;

        // Parse trek pictures, and change their URL
        angular.forEach(copy.features, function(poi) {
            var thumbnailUrl = poi.properties.thumbnail;
            poi.properties.thumbnail = _this.convertServerUrlToRemoteUrl(poi.properties.thumbnail);
            poi.properties.type.pictogram = _this.convertServerUrlToRemoteUrl(poi.properties.type.pictogram);
            angular.forEach(poi.properties.pictures, function(picture) {
                picture.url = _this.convertServerUrlToRemoteUrl(picture.url);
            });
        });
        return copy;
    };

    this.getPoisFromTrek = function(trekId) {

        var trek_pois_url = globalizationSettings.TREK_REMOTE_FILE_URL_BASE + '/' + trekId + '/' + settings.POI_FILE_NAME,
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