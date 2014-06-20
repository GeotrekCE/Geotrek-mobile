'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile) {

    var CDV_ROOT = 'cdvfile://localhost/persistent',
        DIR_NAME = 'geotrek',
        TREK_FILENAME = 'trek.geojson',
        TREKS_FILE_FULL_PATH = CDV_ROOT + '/' + DIR_NAME + '/' + TREK_FILENAME,
        TREK_SUBDIR = 'trek',
        DOMAIN_NAME = 'http://rando.makina-corpus.net';

    this.getTrekSubdir = function(trekId) {
        return DIR_NAME + '/' + TREK_SUBDIR + '/' + trekId.toString();
    };

    this.replaceImgURLs = function(trekData) {
        var copy = angular.copy(trekData, {});

        // Parse trek pictures, and change their URL
        angular.forEach(copy.features, function(trek) {
            var currentTrekId = trek.id;
            angular.forEach(trek.properties.pictures, function(picture) {
                var pictureUrl = picture.url;
                var filename = pictureUrl.substr(pictureUrl.lastIndexOf('/') + 1);

                picture.url = CDV_ROOT + '/' + DIR_NAME + '/' + TREK_SUBDIR + '/' + currentTrekId.toString() + '/' + filename;
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
            console.log('downloading ' + url + ' to ' + TREKS_FILE_FULL_PATH);
            return $cordovaFile.downloadFile(url, TREKS_FILE_FULL_PATH);
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

                    var serverUrl = DOMAIN_NAME + pictureUrl;
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
            var path = CDV_ROOT + '/' + DIR_NAME + '/' + TREK_SUBDIR + '/' + trekId.toString() + '/' + pictureName;
            console.log('downloading ' + url + ' to ' + path);
            return $cordovaFile.downloadFile(url, path);
        });
    };

    this.hasTreks = function() {
        return $cordovaFile.checkFile(DIR_NAME + '/' + TREK_FILENAME);
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

        var filePath = DIR_NAME + "/" + TREK_FILENAME,
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