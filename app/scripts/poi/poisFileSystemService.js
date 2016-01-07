'use strict';

var geotrekPois = angular.module('geotrekPois');

geotrekPois.service('poisFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile, settings, globalSettings, globalizationSettings, utils, mapFactory) {
    var _pois = {};

    this._getPoisTrekAbsoluteURL = function(trekId) {
        var deferred = $q.defer();
        globalizationSettings.getCurrentLang()
            .then(
                function (currentLang) {
                    var url = settings.device.CDV_TREK_ROOT.replace(/\$lang/, currentLang) + '/' + trekId.toString() + '/' + settings.POI_FILE_NAME;
                    deferred.resolve(url);
                }
            );
        return deferred.promise;
    };

    this._getPoisTrekRelativeURL = function(trekId) {
        var deferred = $q.defer();
        globalizationSettings.getCurrentLang()
            .then(
                function (currentLang) {
                    var url = settings.device.RELATIVE_TREK_ROOT.replace(/\$lang/, currentLang)  + '/' + trekId.toString() + '/' + settings.POI_FILE_NAME;
                    deferred.resolve(url);
                }
            );

        return deferred.promise;
    };

    this.convertServerUrlToPoiFileSystemUrl = function(trekId, serverUrl) {
        return settings.device.CDV_APP_ROOT + serverUrl;
    };

    this.convertServerUrlToPictoFileSystemUrl = function(serverUrl) {
        return settings.device.CDV_APP_ROOT + serverUrl;
    };

    this.replaceImgURLs = function(poiData, isLocal, trekId) {
        var copy = angular.copy(poiData, {}),
            _this = this;
        // Parse poi pictures, and change their URL
        angular.forEach(copy.features, function(poi) {

            if(poi.properties.type.pictogram) {
                poi.properties.type.pictogram = _this.convertServerUrlToPictoFileSystemUrl(poi.properties.type.pictogram);
            }

            if (isLocal) {
                angular.forEach(poi.properties.pictures, function(picture) {
                    picture.url = _this.convertServerUrlToPoiFileSystemUrl(trekId, picture.url);
                });

                if(poi.properties.thumbnail) {
                    poi.properties.thumbnail = _this.convertServerUrlToPoiFileSystemUrl(trekId, poi.properties.thumbnail);
                }
            }else {
                angular.forEach(poi.properties.pictures, function(picture) {
                    picture.url = globalSettings.DOMAIN_NAME + picture.url;
                });

                if(poi.properties.thumbnail) {
                    poi.properties.thumbnail = globalSettings.DOMAIN_NAME + poi.properties.thumbnail;
                }
            }

        });
        return copy;
    };

    // Getting Pois used for mobile purpose
    // Image urls are converted to cdv://localhost/persistent/... ones
    this.getPoisFromTrek = function(trekId) {
        return this._getPoisFromTrek(trekId);
    };

    this._getPoisFromTrek = function(trekId) {
        var deferred = $q.defer(),
            self = this;

        mapFactory.hasTrekPreciseBackground(trekId).
        then(function(isLocal) {
            if(!_pois[trekId] || (_pois[trekId] && _pois[trekId].localFiles !== isLocal)) {

                self._getPoisTrekRelativeURL(trekId)
                    .then(
                        function (trekPoisFilepath) {
                            $cordovaFile.readAsText(trekPoisFilepath)
                            .then(
                                function(data) {
                                    var jsonData = JSON.parse(data);
                                    jsonData = self.replaceImgURLs(jsonData, isLocal, trekId);
                                    _pois[trekId] = jsonData;
                                    _pois[trekId].localFiles = isLocal;
                                    deferred.resolve(_pois[trekId]);
                                },
                                deferred.reject
                            );
                        }
                    );
            } else {
                deferred.resolve(_pois[trekId]);
            }
        });
        var deferred = $q.defer();

        return deferred.promise;
    };

});