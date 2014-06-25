'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation', []);

geotrekGeolocation.factory('geolocationFactory', ['$injector', '$window', '$q', function ($injector, $window, $q) {

    var geolocationFactory;

    if (angular.isDefined($window.cordova) && (!$window.ionic.Platform.isAndroid())) {
        geolocationFactory = $injector.get('geolocationDeviceService');
    }
    else {
        geolocationFactory = $injector.get('geolocationRemoteService');
    }

    // Code from http://www.w3schools.com/html/html5_geolocation.asp
    function convertError(error) {
        var msg,
            // Following http://dev.w3.org/geo/api/spec-source.html#geolocation_interface for error codes
            PERMISSION_DENIED = 1,
            POSITION_UNAVAILABLE = 2,
            TIMEOUT = 3;

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
                if (error.message) {
                    msg = error.message;
                }
                else {
                    msg = "An unknown error occurred.";
                }

                break;
        }
        return {message: msg};
    }

    geolocationFactory.getLatLonPosition = function(options) {

        var deferred = $q.defer();

        geolocationFactory.getCurrentPosition(options)
            .then(function(position) {
                deferred.resolve({'lat': position.coords.latitude, 'lon': position.coords.longitude});
            }, function(error) {
                deferred.reject(convertError(error));
            });

        return deferred.promise;
    }

    return geolocationFactory;

}]);
