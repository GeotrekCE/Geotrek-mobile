'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile, settings) {

    this.getTrekSubdir = function(trekId) {
        return settings.device.RELATIVE_TREK_ROOT + '/' + trekId.toString();
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
        });
        return copy;
    };

    this.downloadTreks = function(url) {
        var _this = this;

        // Checking if treks are already downloaded
        return this.getRawTreks()
        .then(function() {
            var deferred = $q.defer();
            deferred.resolve({message: 'Treks already downloaded'});
            return deferred.promise;
        }, function() {
            // If not, let's go !!
            console.log('downloading ' + url + ' to ' + settings.device.CDV_TREK_ROOT_FILE);
            return $cordovaFile.downloadFile(url, settings.device.CDV_TREK_ROOT_FILE);
        })
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
                    promises.push(_this.downloadTrekPicture(currentTrekId, filename, serverUrl));
                });
            })

            return $q.all(promises);
        });
    };

    this.downloadTrekPicture = function(trekId, pictureName, url) {
        return $cordovaFile.checkFile(this.getTrekSubdir(trekId) + '/' + pictureName)
        .then(function() {
            var deferred = $q.defer();
            deferred.resolve({message: 'picture ' + pictureName + ' already present'});
            return deferred.promise;
            // picture already present, not downloading it
        }, function() {
            var path = settings.device.CDV_TREK_ROOT + '/' + trekId.toString() + '/' + pictureName;
            console.log('downloading ' + url + ' to ' + path);
            return $cordovaFile.downloadFile(url, path);
        });
    };

    this.hasTreks = function() {
        return $cordovaFile.checkFile(settings.device.RELATIVE_TREK_ROOT_FILE);
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

        $cordovaFile.readFile(filePath)
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