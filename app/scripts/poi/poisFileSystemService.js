'use strict';

var geotrekPois = angular.module('geotrekPois');

geotrekPois.service('poisFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile, settings) {

    this._getPoisTrekAbsoluteURL = function(trekId) {
        return settings.device.CDV_TREK_ROOT + '/' + trekId.toString() + '/' + settings.POI_FILE_NAME;
    };

    this._getPoisTrekRelativeURL = function(trekId) {
        return settings.device.RELATIVE_TREK_ROOT + '/' + trekId.toString() + '/' + settings.POI_FILE_NAME;
    };

    this.replaceImgURLs = function(poiData) {
        var copy = angular.copy(poiData, {});

        // Parse poi pictures, and change their URL
        angular.forEach(copy.features, function(poi) {
            var currentPoiId = poi.id;

            var thumbnailUrl = poi.properties.thumbnail,
                thFilename = thumbnailUrl.substr(thumbnailUrl.lastIndexOf('/') + 1);

            poi.properties.thumbnail = settings.device.CDV_POI_ROOT + '/' + currentPoiId.toString() + '/' + thFilename;

            angular.forEach(poi.properties.pictures, function(picture) {
                var pictureUrl = picture.url;
                var filename = pictureUrl.substr(pictureUrl.lastIndexOf('/') + 1);

                picture.url = settings.device.CDV_POI_ROOT + '/' + currentPoiId.toString() + '/' + filename;
            });
        });
        return copy;
    };

    this.downloadPoisFromTrek = function(trekId) {
        var trekPoisURL = settings.remote.TREK_REMOTE_FILE_URL_BASE + '/' + trekId + '/' + settings.POI_FILE_NAME,
            trekPoisFilepath = this._getPoisTrekAbsoluteURL(trekId),
            _this = this;

        return this.hasPoisFromTrek(trekId)
        .then(function() {
            var deferred = $q.defer();
            deferred.resolve({message: 'Pois already downloaded for trek ' + trekId.toString()});
            return deferred.promise;
        }, function() {
            // If not, let's go !!
            console.log('downloading ' + trekPoisURL + ' to ' + trekPoisFilepath);
            return $cordovaFile.downloadFile(trekPoisURL, trekPoisFilepath);
        })
        .then(function() {
            return _this.downloadPoisImages(trekId);
        });
    };

    this.downloadPois = function(trekIds) {
        // Checking if treks are already downloaded
        var promises = [],
            _this = this;

        angular.forEach(trekIds, function(trekId) {
            promises.push(_this.downloadPoisFromTrek(trekId));
        });

        return $q.all(promises);
    };

    this.downloadPoisImages = function(trekId) {
        var _this = this;

        return this.getRawPoisFromTrek(trekId)
        .then(function(pois) {
            var promises = [];

            angular.forEach(pois.features, function(poi) {
                var currentPoiId = poi.id;

                var thumbnailUrl = poi.properties.thumbnail;
                if (!!thumbnailUrl) {
                    var filename = thumbnailUrl.substr(thumbnailUrl.lastIndexOf('/') + 1);
                    promises.push(_this.downloadPoiImage(currentPoiId, filename, settings.DOMAIN_NAME + thumbnailUrl))
                }

                angular.forEach(poi.properties.pictures, function(picture) {
                    var pictureUrl = picture.url;
                    var picFilename = pictureUrl.substr(pictureUrl.lastIndexOf('/') + 1);
                    promises.push(_this.downloadPoiImage(currentPoiId, picFilename, settings.DOMAIN_NAME + pictureUrl));
                });
            })

            return $q.all(promises);
        });
    };

    this.downloadPoiImage = function(poiId, pictureName, url) {
        return $cordovaFile.checkFile(settings.device.RELATIVE_POI_ROOT + '/' + poiId + '/' + pictureName)
        .then(function() {
            var deferred = $q.defer();
            deferred.resolve({message: 'picture ' + pictureName + ' already present'});
            return deferred.promise;
            // picture already present, not downloading it
        }, function() {
            var path = settings.device.CDV_POI_ROOT + '/' + poiId.toString() + '/' + pictureName;
            console.log('downloading ' + url + ' to ' + path);
            return $cordovaFile.downloadFile(url, path);
        });
    };

    this.hasPoisFromTrek = function(trekId) {
        var trekPoisFilepath = this._getPoisTrekRelativeURL(trekId);
        return $cordovaFile.checkFile(trekPoisFilepath);
    }

    // Getting Pois used for mobile purpose
    // Image urls are converted to cdv://localhost/persistent/... ones
    this.getPoisFromTrek = function(trekId) {
        var replaceUrls = true;
        return this._getPoisFromTrek(trekId, replaceUrls);
    };

    // Getting server trek original data
    this.getRawPoisFromTrek = function(trekId) {
        var replaceUrls = false;
        return this._getPoisFromTrek(trekId, replaceUrls);
    };

    this._getPoisFromTrek = function(trekId, replaceUrls) {

        var trekPoisFilepath = this._getPoisTrekRelativeURL(trekId),
            deferred = $q.defer(),
            _this = this;

        $cordovaFile.readFile(trekPoisFilepath)
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