'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.service('mapRemoteService', ['$q', '$localStorage', 'settings', function ($q, $localStorage, settings) {

    var EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY = 'emulated-background',
        EMULATED_DOWNLOAD_LOCALSTORAGE_KEY = 'trek-';

    if (!$localStorage[EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY]) {
        $localStorage[EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY] = {};
    }

    this.getGlobalTileLayerURL = function() {
        return settings.remote.LEAFLET_BACKGROUND_URL;
    };

    // We don't have to download Map Background in Remote version, only for device offline mode
    this.downloadGlobalBackground = function(url) {
        var deferred = $q.defer();
        deferred.resolve({message: 'No need to download map Background in browser mode'});
        return deferred.promise;
    };

    this.cleanDownloadedLayers = function() {
        var deferred = $q.defer();
        $localStorage[EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY] = {};
        deferred.resolve();
        return deferred.promise;
    };

    this._getLocalStorageKey = function(trekId) {
        return EMULATED_DOWNLOAD_LOCALSTORAGE_KEY + trekId.toString();
    }

    // We want to simulate correct trek background downloading
    this.downloadTrekPreciseBackground = function(trekId) {
        $localStorage[EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY][this._getLocalStorageKey(trekId)] = 'OK';
    };

    this.hasTrekPreciseBackground = function(trekId) {
        return angular.isDefined($localStorage[EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY][this._getLocalStorageKey(trekId)]);
    };

}]);
