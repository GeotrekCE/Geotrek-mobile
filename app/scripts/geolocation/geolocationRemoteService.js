'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation');

geotrekGeolocation.service('geolocationRemoteService', ['$q', function ($q) {

    this.getCurrentPosition = function(options) {

        var deferred = $q.defer();

        // Using HTML5 geolocation API
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    deferred.resolve(position);
                }, function(positionError) {
                    deferred.reject(positionError);
              }, options);
        } else {
            deferred.reject({message: 'Your browser does not support HTML5 geolocation API.'});
        }

        return deferred.promise;
    };        
}]);
