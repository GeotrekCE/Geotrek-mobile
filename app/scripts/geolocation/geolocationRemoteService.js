'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation');

geotrekGeolocation.service('geolocationRemoteService', ['$q', function ($q) {

    this.getCurrentPosition = function(options) {

        var deferred = $q.defer();

        function showPosition(position) {
            deferred.resolve(position);
        }

        // Code from http://www.w3schools.com/html/html5_geolocation.asp
        function showError(error) {
            var msg;
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    msg = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    msg = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    msg = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
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
