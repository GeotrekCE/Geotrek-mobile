'use strict';

var geotrekTouristics = angular.module('geotrekTouristics');

geotrekTouristics.service('touristicsFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile, settings, globalSettings, globalizationSettings, utils, mapFactory) {
    var _touristicContents = {};
    var _touristicEvents = {};

    this._getTouristicContentsTrekAbsoluteURL = function(trekId) {
        return settings.device.CDV_TREK_ROOT + '/' + trekId.toString() + '/' + settings.TOURISTIC_CONTENTS_FILE_NAME;
    };

    this._getTouristicContentsTrekRelativeURL = function(trekId) {
        return settings.device.RELATIVE_TREK_ROOT + '/' + trekId.toString() + '/' + settings.TOURISTIC_CONTENTS_FILE_NAME;
    };

    this._getTouristicEventsTrekAbsoluteURL = function(trekId) {
        return settings.device.CDV_TREK_ROOT + '/' + trekId.toString() + '/' + settings.TOURISTIC_EVENTS_FILE_NAME;
    };

    this._getTouristicEventsTrekRelativeURL = function(trekId) {
        return settings.device.RELATIVE_TREK_ROOT + '/' + trekId.toString() + '/' + settings.TOURISTIC_EVENTS_FILE_NAME;
    };

    this.convertServerUrlToPictoFileSystemUrl = function(serverUrl) {
        return settings.device.CDV_APP_ROOT + serverUrl;
    };

    this.replaceImgURLs = function(touristicData, isLocal, trekId) {
        var copy = angular.copy(touristicData, {}),
            _this = this;
        // Parse touristic pictures, and change their URL
        angular.forEach(copy.features, function(touristic) {

            if(touristic.properties.category) {
                touristic.properties.category.pictogram = _this.convertServerUrlToPictoFileSystemUrl(touristic.properties.category.pictogram);
            }

            if (isLocal) {
                angular.forEach(touristic.properties.pictures, function(picture) {
                    picture.url = _this.convertServerUrlToPictoFileSystemUrl(picture.url);
                });

                if(touristic.properties.thumbnail) {
                    touristic.properties.thumbnail = _this.convertServerUrlToPictoFileSystemUrl(touristic.properties.thumbnail);
                }
            }else {
                angular.forEach(touristic.properties.pictures, function(picture) {
                    picture.url = globalSettings.DOMAIN_NAME + picture.url;
                });

                if(touristic.properties.thumbnail) {
                    touristic.properties.thumbnail = globalSettings.DOMAIN_NAME + touristic.properties.thumbnail;
                }
            }

        });
        return copy;
    };

    this.replaceCategoriesImgURLs = function(touristicData) {
        var _this = this;

        // Parse trek pictures, and change their URL
        angular.forEach(touristicData.features, function(category) {
            if (category.pictogram) {
                category.pictogram = _this.convertServerUrlToPictoFileSystemUrl(category.pictogram);
            }
        });
        return touristicData;
    };


    this.getTouristicContentsFromTrek = function(trekId) {
        var deferred = $q.defer(),
            self = this;

        mapFactory.hasTrekPreciseBackground(trekId).
        then(function(isLocal) {
            if(!_touristicContents[trekId] || (_touristicContents[trekId] && _touristicContents[trekId].localFiles !== isLocal)) {
                var trekTouristicsFilepath = self._getTouristicContentsTrekRelativeURL(trekId),
                    _this = self;

                $cordovaFile.readAsText(trekTouristicsFilepath)
                .then(
                    function(data) {
                        var jsonData = JSON.parse(data);
                        jsonData = _this.replaceImgURLs(jsonData, isLocal, trekId);
                        _touristicContents[trekId] = jsonData;
                        _touristicContents[trekId].localFiles = isLocal;
                        deferred.resolve(_touristicContents[trekId]);
                    },
                    deferred.reject
                );
            } else {
                deferred.resolve(_touristicContents[trekId]);
            }
        });

        return deferred.promise;
    };

    this.getTouristicEventsFromTrek = function(trekId) {
        var deferred = $q.defer(),
            self = this;

        mapFactory.hasTrekPreciseBackground(trekId).
        then(function(isLocal) {
            if(!_touristicEvents[trekId] || (_touristicEvents[trekId] && _touristicEvents[trekId].localFiles !== isLocal)) {
                var trekTouristicsFilepath = self._getTouristicEventsTrekRelativeURL(trekId),
                    _this = self;

                $cordovaFile.readAsText(trekTouristicsFilepath)
                .then(
                    function(data) {
                        var jsonData = JSON.parse(data);
                        jsonData = _this.replaceImgURLs(jsonData, isLocal, trekId);
                        _touristicEvents[trekId] = jsonData;
                        _touristicEvents[trekId].localFiles = isLocal;
                        deferred.resolve(_touristicEvents[trekId]);
                    },
                    deferred.reject
                );
            } else {
                deferred.resolve(_touristicEvents[trekId]);
            }
        });

        return deferred.promise;
    };

    this.getTouristicCategoriesData = function() {
        var deferred = $q.defer();

        var touristicCategoriesFilepath = settings.device.RELATIVE_TOURISTIC_CATEGORIES_ROOT;

        $cordovaFile.readAsText(touristicCategoriesFilepath)
        .then(
            function(file) {
                var jsonData = JSON.parse(file);
                deferred.resolve(jsonData);
            },
            deferred.reject
        );

        return deferred.promise;
    };

});