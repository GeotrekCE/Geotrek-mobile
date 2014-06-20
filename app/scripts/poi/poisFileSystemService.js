'use strict';

var geotrekPois = angular.module('geotrekPois');

geotrekPois.service('poisFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile) {

    var DOMAIN_NAME = 'http://rando.makina-corpus.net',
        REMOTE_FILE_URL = DOMAIN_NAME + '/fr/files/api/trek',
        POI_FILE_NAME = 'pois.geojson',
        CDV_ROOT = 'cdvfile://localhost/persistent',
        GEOTREK_DIR = 'geotrek',
        DIR_NAME = 'geotrek/trek',
        POI_DIR_NAME = 'geotrek/poi',
        POI_SUBDIR = 'poi',
        POI_FILENAME = 'pois.geojson';

    this._getPoisTrekAbsoluteURL = function(trekId) {
        return CDV_ROOT + '/' + DIR_NAME + '/' + trekId.toString() + '/' + POI_FILENAME;
    };

    this._getPoisTrekRelativeURL = function(trekId) {
        return DIR_NAME + '/' + trekId.toString() + '/' + POI_FILENAME;
    };

    this.replaceImgURLs = function(poiData) {
        var copy = angular.copy(poiData, {});

        // Parse poi pictures, and change their URL
        angular.forEach(copy.features, function(poi) {
            var currentPoiId = poi.id;

            var thumbnailUrl = poi.properties.thumbnail,
                thFilename = thumbnailUrl.substr(thumbnailUrl.lastIndexOf('/') + 1);

            poi.properties.thumbnail = CDV_ROOT + '/' + GEOTREK_DIR + '/' + POI_SUBDIR + '/' + currentPoiId.toString() + '/' + thFilename;

            angular.forEach(poi.properties.pictures, function(picture) {
                var pictureUrl = picture.url;
                var filename = pictureUrl.substr(pictureUrl.lastIndexOf('/') + 1);

                picture.url = CDV_ROOT + '/' + GEOTREK_DIR + '/' + POI_SUBDIR + '/' + currentPoiId.toString() + '/' + filename;
            });
        });
        return copy;
    };

    this.downloadPoisFromTrek = function(trekId) {
        var trekPoisURL = REMOTE_FILE_URL + '/' + trekId + '/' + POI_FILE_NAME,
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
                    filename = thumbnailUrl.substr(thumbnailUrl.lastIndexOf('/') + 1);
                    promises.push(_this.downloadPoiImage(currentPoiId, filename, DOMAIN_NAME + thumbnailUrl))
                }

                angular.forEach(poi.properties.pictures, function(picture) {
                    var pictureUrl = picture.url;
                    var picFilename = pictureUrl.substr(pictureUrl.lastIndexOf('/') + 1);
                    promises.push(_this.downloadPoiImage(currentPoiId, picFilename, DOMAIN_NAME + pictureUrl));
                });
            })

            return $q.all(promises);
        });
    };

    this.downloadPoiImage = function(poiId, pictureName, url) {
        return $cordovaFile.checkFile(POI_DIR_NAME + '/' + poiId + '/' + pictureName)
        .then(function() {
            var deferred = $q.defer();
            deferred.resolve({message: 'picture ' + pictureName + ' already present'});
            return deferred.promise;
            // picture already present, not downloading it
        }, function() {
            var path = CDV_ROOT + '/' + GEOTREK_DIR + '/' + POI_SUBDIR + '/' + poiId.toString() + '/' + pictureName;
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