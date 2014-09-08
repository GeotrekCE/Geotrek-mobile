'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile, settings, utils) {

    this.getTrekSubdir = function(trekId) {
        return settings.device.CDV_TREK_ROOT + '/' + trekId.toString();
    };

    this.replaceImgURLs = function(trekData) {
        var copy = angular.copy(trekData, {});

        // Parse trek pictures, and change their URL
        angular.forEach(copy.features, function(trek) {
            var currentTrekId = trek.id;
            angular.forEach(trek.properties.pictures, function(picture) {
                var pictureUrl = picture.url;
                var filename = pictureUrl.substr(pictureUrl.lastIndexOf('/') + 1);

                picture.url = settings.device.CDV_TREK_ROOT + '/' + currentTrekId.toString() + '/' + filename;
            });
            angular.forEach(trek.properties.usages, function(usage) {
                var usageUrl = usage.pictogram;
                var filename = usageUrl.substr(usageUrl.lastIndexOf('/') + 1);

                usage.pictogram = settings.device.CDV_TREK_ROOT + '/' + currentTrekId.toString() + '/' + filename;
            });
        });
        return copy;
    };

    this.downloadTreks = function(url) {
        var _this = this;

        return utils.downloadFile(url, settings.device.CDV_TREK_ROOT_FILE)
        .then(function() {
            return _this.downloadTrekPictures();
        });
    };

    this.downloadTrekPictures = function() {

        var _this = this;

        return this.getRawTreks()
        .then(function(treks) {
            var promises = [];

            angular.forEach(treks.features, function(trek) {
                var currentTrekId = trek.id;
                angular.forEach(trek.properties.pictures, function(picture) {
                    var pictureUrl = picture.url;

                    var serverUrl = settings.DOMAIN_NAME + pictureUrl;
                    var filename = pictureUrl.substr(pictureUrl.lastIndexOf('/') + 1);
                    promises.push(utils.downloadFile(serverUrl, _this.getTrekSubdir(currentTrekId) + '/' + filename));
                });
                angular.forEach(trek.properties.usages, function(usage) {
                    var usageUrl = usage.pictogram;

                    var serverUrl = settings.DOMAIN_NAME + usageUrl;
                    var filename = usageUrl.substr(usageUrl.lastIndexOf('/') + 1);
                    promises.push(utils.downloadFile(serverUrl, _this.getTrekSubdir(currentTrekId) + '/' + filename));
                });
            })

            return $q.all(promises);
        });
    };

    // Getting treks used for mobile purpose
    // Image urls are converted to cdv://localhost/persistent/... ones
    this.getTreks = function() {
        var replaceUrls = true;
        return this._getTreks(replaceUrls);
    };

    // Getting server trek original data
    this.getRawTreks = function() {
        var replaceUrls = false;
        return this._getTreks(replaceUrls);
    };

    this._getTreks = function(replaceUrls) {

        var filePath = settings.device.RELATIVE_TREK_ROOT_FILE,
            deferred = $q.defer(),
            _this = this;

        $cordovaFile.readAsText(filePath)
        .then(
            function(data) {
                var jsonData = JSON.parse(data);
                if (replaceUrls) {
                    jsonData = _this.replaceImgURLs(jsonData);
                }
                deferred.resolve(jsonData);
            },
            deferred.reject
        );

        return deferred.promise;
    };

});