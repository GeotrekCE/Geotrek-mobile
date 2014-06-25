'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation');

geotrekGeolocation.service('geolocationRemoteService', ['$q', function ($q) {

    this.getCurrentPosition = function(options) {

        var deferred = $q.defer(),
            // Following http://dev.w3.org/geo/api/spec-source.html#geolocation_interface for error codes
            PERMISSION_DENIED = 1,
            POSITION_UNAVAILABLE = 2,
            TIMEOUT = 3;

        function showPosition(position) {
            deferred.resolve(position);
        }

        // Code from http://www.w3schools.com/html/html5_geolocation.asp
        function showError(error) {
            var msg;
            switch(error.code) {
                case PERMISSION_DENIED:
                    msg = "User denied the request for Geolocation."
                    break;
                case POSITION_UNAVAILABLE:
                    msg = "Location information is unavailable."
                    break;
                case TIMEOUT:
                    msg = "The request to get user location timed out."
                    break;
                default:
                    msg = "An unknown error occurred."
                    break;
            }
            deferred.reject({message: msg});
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            deferred.reject({message: 'Your browser does not support HTML5 geolocation API.'});
        }

        return deferred.promise;
    };        
}]);
