'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksRemoteService', ['$resource', '$rootScope', '$window', '$q', 'globalSettings', 'globalizationSettings', function ($resource, $rootScope, $window, $q, globalSettings, globalizationSettings) {

    this.replaceImgURLs = function(trekData) {
        var copy = angular.copy(trekData, {});

        // Parse trek pictures, and change their URL
        angular.forEach(copy.features, function(trek) {
            var currentTrekId = trek.id;
            angular.forEach(trek.properties.pictures, function(picture) {
                picture.url = globalSettings.DOMAIN_NAME + picture.url;
            });
            angular.forEach(trek.properties.usages, function(usage) {
                usage.pictogram = globalSettings.DOMAIN_NAME + usage.pictogram;
            });
            angular.forEach(trek.properties.accessibilities, function(accessibility) {
                accessibility.pictogram = globalSettings.DOMAIN_NAME + accessibility.pictogram;
            });
            angular.forEach(trek.properties.themes, function(theme) {
                theme.pictogram = globalSettings.DOMAIN_NAME + theme.pictogram;
            });
            angular.forEach(trek.properties.networks, function(network) {
                network.pictogram = globalSettings.DOMAIN_NAME + network.pictogram;
            });
            angular.forEach(trek.properties.information_desks, function(information_desk) {
                information_desk.photo_url = globalSettings.DOMAIN_NAME + information_desk.photo_url;
            });
            if(trek.properties['length']) {
                trek.properties.eLength = trek.properties['length'];
            }
            if(trek.properties.thumbnail) {
                trek.properties.thumbnail = globalSettings.DOMAIN_NAME + trek.properties.thumbnail;
            }
            if(trek.properties.difficulty) {
                trek.properties.difficulty.pictogram = globalSettings.DOMAIN_NAME + trek.properties.difficulty.pictogram;
            }
            if(trek.properties.category) {
                trek.properties.category.pictogram = globalSettings.DOMAIN_NAME + trek.properties.category.pictogram;
            }
            if(trek.properties.route){
                trek.properties.route.pictogram = globalSettings.DOMAIN_NAME + trek.properties.route.pictogram;
            }
            trek.properties.altimetric_profile = globalSettings.DOMAIN_NAME + trek.properties.altimetric_profile.replace(".json", ".png");
        });
        return copy;
    };

    this.getTreks = function() {
        var requests = $resource(globalizationSettings.TREK_REMOTE_FILE_URL, {}, {
                query: {
                    method: 'GET',
                    cache: true
                }
            }),
            deferred = $q.defer(),
            _this = this;

        requests.query().$promise
            .then(function(file) {
                var data = angular.fromJson(file),
                    convertedData = _this.replaceImgURLs(data);
                deferred.resolve(convertedData);
            });

        return deferred.promise;
    };

}]);