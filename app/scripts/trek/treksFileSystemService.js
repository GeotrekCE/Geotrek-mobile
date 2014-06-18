'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksFileSystemService', function ($resource, $rootScope, $window, $q, Files) {

    this.getTreks = function() {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    };

    this.getTrek = function(_trekId) {
        var trekId = parseInt(_trekId),
            deferred = $q.defer();
        deferred.resolve(_trekId);
        return deferred.promise;
    };

});