'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.service('mapRemoteService', ['$q', '$localStorage', function ($q, $localStorage) {

    var EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY = 'emulated-background',
        EMULATED_DOWNLOAD_LOCALSTORAGE_KEY = 'trek-';

    if (!$localStorage[EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY]) {
        $localStorage[EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY] = {};
    }

    // We don't have to download Map Background in Remote version, only for device offline mode
    this.downloadGlobalBackground = function(url) {
        var deferred = $q.defer();
        deferred.resolve({message: 'No need to download map Background in browser mode'});
        return deferred.promise;
    };

    this.isReady = function() {
        var deferred = $q.defer();
        deferred.resolve({message: 'Tiles are always available in browser mode'});
        return deferred.promise;
    };

    this.getGlobalTileLayer = function() {
        var deferred = $q.defer();
        var tileLayer = new L.TileLayer('http://{s}.livembtiles.makina-corpus.net/makina/OSMTopo/{z}/{x}/{y}.png');
        deferred.resolve({
            id: 'OSMTopo',
            name: 'OSMTopo',
            type: 'custom',
            layer: tileLayer,
        });

        return deferred.promise;
    };

    this.cleanDownloadedLayers = function() {
        var deferred = $q.defer();
        $localStorage[EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY] = {};
        deferred.resolve();
        return deferred.promise;
    };

    // There is no precise layer in browser mode, as we are always using global background
    this.getDownloadedLayers = function() {
        var deferred = $q.defer();
        deferred.resolve([]);
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

    this.removeTrekPreciseBackground = function(trekId) {
        delete $localStorage[EMULATED_DOWNLOAD_LOCALSTORAGE_ROOT_KEY][this._getLocalStorageKey(trekId)];
    };

}]);
