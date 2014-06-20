'use strict';

var geotrekPois = angular.module('geotrekPois');

geotrekPois.service('poisFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile) {

    var REMOTE_FILE_URL = 'http://rando.makina-corpus.net/fr/files/api/trek',
        POI_FILE_NAME = 'pois.geojson',
        CDV_ROOT = 'cdvfile://localhost/persistent',
        DIR_NAME = 'geotrek/trek',
        POI_FILENAME = 'pois.geojson';

    this._getPoisTrekAbsoluteURL = function(trekId) {
        return CDV_ROOT + '/' + DIR_NAME + '/' + trekId.toString() + '/' + POI_FILENAME;
    };

    this._getPoisTrekRelativeURL = function(trekId) {
        return DIR_NAME + '/' + trekId.toString() + '/' + POI_FILENAME;
    };

    this.downloadPoisFromTrek = function(trekId) {
        var trekPoisURL = REMOTE_FILE_URL + '/' + trekId + '/' + POI_FILE_NAME,
            trekPoisFilepath = this._getPoisTrekAbsoluteURL(trekId);

        return this.hasPoisFromTrek(trekId)
        .then(function() {
            var deferred = $q.defer();
            deferred.resolve({message: 'Pois already downloaded for trek ' + trekId.toString()});
            return deferred.promise;
        }, function() {
            // If not, let's go !!
            console.log('downloading ' + trekPoisURL + ' to ' + trekPoisFilepath);
            return $cordovaFile.downloadFile(trekPoisURL, trekPoisFilepath);
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

    this.hasPoisFromTrek = function(trekId) {
        var trekPoisFilepath = this._getPoisTrekRelativeURL(trekId);
        return $cordovaFile.checkFile(trekPoisFilepath);
    }

    this.getPoisFromTrek = function(trekId) {

        var trekPoisFilepath = this._getPoisTrekRelativeURL(trekId);

        $cordovaFile.readFile(trekPoisFilepath)
        .then(
            function(data) {
                var jsonData = JSON.parse(data);
                defered.resolve(jsonData);
            },
            defered.reject
        );

        return defered.promise;
    };

});