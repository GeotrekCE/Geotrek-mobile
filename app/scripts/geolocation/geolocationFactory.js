'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation', []);

geotrekGeolocation.factory('geolocationFactory', ['$injector', '$window', '$q', '$rootScope', 'logging', function ($injector, $window, $q, $rootScope, logging) {

    var geolocationFactory;

    // On Android, HTML5 geolocation is better than native one, support for android
    // has been dropped (https://issues.apache.org/jira/browse/CB-5977)
    // That's why we test if platform is Android
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

    geolocationFactory.getLatLngPosition = function(options, watchCallback) {

        var deferred = $q.defer();

        // Cleaning watch to resolve weird no-callback issue
        // See MapController for more precisions
        if (!!$rootScope.watchID) {
            logging.info('There is a watch, cleaning it before getting user LatLng position');
            geolocationFactory.clearWatch($rootScope.watchID);
        }

        geolocationFactory.getCurrentPosition(options)
            .then(function(position) {
                if (watchCallback) {
                    watchCallback();
                }
                deferred.resolve({'lat': position.coords.latitude, 'lng': position.coords.longitude});
            }, function(error) {
                if (watchCallback) {
                    watchCallback();
                }
                deferred.reject(convertError(error));
            });

        return deferred.promise;
    }

    return geolocationFactory;

}]);
