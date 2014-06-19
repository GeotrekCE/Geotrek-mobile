'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksFileSystemService', function ($resource, $rootScope, $window, $q, Files, $cordovaFile) {

    var CDV_ROOT = 'cdvfile://localhost/persistent',
        DIR_NAME = 'geotrek',
        TREK_FILENAME = 'trek.geojson',
        TREKS_FILE_FULL_PATH = CDV_ROOT + '/' + DIR_NAME + '/' + TREK_FILENAME;

    this.downloadTreks = function(url) {
        // Checking if treks are already downloaded
        return this.hasTreks()
        .then(function() {
            var deferred = $q.defer();
            deferred.resolve('already downloaded');
            return deferred.promise;
        }, function() {
            // If not, let's go !!
            return $cordovaFile.downloadFile(url, TREKS_FILE_FULL_PATH);
        });
    };

    this.hasTreks = function() {
        return $cordovaFile.checkFile(DIR_NAME + '/' + TREK_FILENAME);
    }

    this.getTreks = function() {

        var filePath = DIR_NAME + "/" + TREK_FILENAME;
        var defered = $q.defer();

        $cordovaFile.readFile(filePath)
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