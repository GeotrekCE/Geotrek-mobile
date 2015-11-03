'use strict';

var geotrekTouristics = angular.module('geotrekTouristics');

geotrekTouristics.service('touristicsRemoteService', function ($resource, $rootScope, $window, $q, $cordovaFile, globalSettings, settings, globalizationSettings) {

    this.convertServerUrlToRemoteUrl = function(serverUrl) {
        return globalSettings.DOMAIN_NAME + serverUrl;
    };

    this.replaceImgURLs = function(touristicData) {
        var copy = angular.copy(touristicData, {}),
            _this = this;

        // Parse trek pictures, and change their URL
        angular.forEach(copy.features, function(touristic) {
            if (touristic.properties.thumbnail) {
                touristic.properties.thumbnail = _this.convertServerUrlToRemoteUrl(touristic.properties.thumbnail);
            }
            if (touristic.properties.category) {
                touristic.properties.category.pictogram = _this.convertServerUrlToRemoteUrl(touristic.properties.category.pictogram);
            }
            angular.forEach(touristic.properties.pictures, function(picture) {
                picture.url = _this.convertServerUrlToRemoteUrl(picture.url);
            });
        });
        return copy;
    };

    this.replaceCategoriesImgURLs = function(touristicData) {
        var _this = this;

        // Parse trek pictures, and change their URL
        angular.forEach(touristicData.features, function(category) {
            if (category.pictogram) {
                category.pictogram = _this.convertServerUrlToRemoteUrl(category.pictogram);
            }
        });
        return touristicData;
    };

    this.getTouristicContentsFromTrek = function(trekId) {

        var trek_touristics_contents_url = globalizationSettings.TREK_REMOTE_API_FILE_URL_BASE + '/' + trekId + '/' + settings.TOURISTIC_CONTENTS_FILE_NAME,
            requests = $resource(trek_touristics_contents_url, {}, {
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

    this.getTouristicCategoriesData = function() {

        var trek_touristics_categories_url = globalizationSettings.REMOTE_API_FILE_URL_BASE + '/' + settings.TOURISTIC_CATEGORIES_DIR,
            requests = $resource(trek_touristics_categories_url, {}, {
                query: {
                    method: 'GET',
                    cache: true
                }
            }),
            deferred = $q.defer();

        requests.query().$promise
            .then(function(data) {
                var jsonData = angular.fromJson(data);
                deferred.resolve(jsonData);
            }, deferred.reject);

        return deferred.promise;
    };

    this.getTouristicEventsFromTrek = function(trekId) {

        var trek_touristics_events_url = globalizationSettings.TREK_REMOTE_API_FILE_URL_BASE + '/' + trekId + '/' + settings.TOURISTIC_EVENTS_FILE_NAME,
            requests = $resource(trek_touristics_events_url, {}, {
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