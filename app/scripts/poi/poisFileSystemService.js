'use strict';

var geotrekPois = angular.module('geotrekPois');

geotrekPois.service('poisFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile, settings, globalizationSettings, utils, mapFactory) {
    var _pois = {};

    this._getPoisTrekAbsoluteURL = function(trekId) {
        return settings.device.CDV_TREK_ROOT + '/' + trekId.toString() + '/' + settings.POI_FILE_NAME;
    };

    this._getPoisTrekRelativeURL = function(trekId) {
        return settings.device.RELATIVE_TREK_ROOT + '/' + trekId.toString() + '/' + settings.POI_FILE_NAME;
    };

    this.convertServerUrlToPoiFileSystemUrl = function(poiId, serverUrl) {
        var filename = serverUrl.substr(serverUrl.lastIndexOf('/') + 1);
        return settings.device.CDV_POI_ROOT + '/' + poiId.toString() + '/' + filename;
    };

    this.convertServerUrlToPictoFileSystemUrl = function(poiId, serverUrl) {
        var filename = serverUrl.substr(serverUrl.lastIndexOf('/') + 1);
        return settings.device.CDV_PICTO_POI_ROOT + '/' + filename;
    };

    this.replaceImgURLs = function(poiData, isLocal) {
        var copy = angular.copy(poiData, {}),
            _this = this;
        // Parse poi pictures, and change their URL
        angular.forEach(copy.features, function(poi) {
            var currentPoiId = poi.id;

            if(poi.properties.type.pictogram) {
                poi.properties.type.pictogram = _this.convertServerUrlToPictoFileSystemUrl(currentPoiId, poi.properties.type.pictogram);
            }

            if (isLocal) {
                angular.forEach(poi.properties.pictures, function(picture) {
                    picture.url = _this.convertServerUrlToPoiFileSystemUrl(currentPoiId, picture.url);
                });

                if(poi.properties.thumbnail) {
                    poi.properties.thumbnail = _this.convertServerUrlToPoiFileSystemUrl(currentPoiId, poi.properties.thumbnail);
                }
            }else {
                angular.forEach(poi.properties.pictures, function(picture) {
                    picture.url = settings.DOMAIN_NAME + picture.url;
                });

                if(poi.properties.thumbnail) {
                    poi.properties.thumbnail = settings.DOMAIN_NAME + poi.properties.thumbnail;
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
                var trekPoisFilepath = self._getPoisTrekRelativeURL(trekId),
                    _this = self;

                $cordovaFile.readAsText(trekPoisFilepath)
                .then(
                    function(data) {
                        var jsonData = JSON.parse(data);
                        jsonData = _this.replaceImgURLs(jsonData,isLocal);
                        _pois[trekId] = jsonData;
                        _pois[trekId].localFiles = isLocal;
                        deferred.resolve(_pois[trekId]);
                    },
                    deferred.reject
                );
            } else {
                deferred.resolve(_pois[trekId]);
            }
        });
        var deferred = $q.defer();
        

        return deferred.promise;
    };

});