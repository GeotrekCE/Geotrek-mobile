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

    geolocationFactory.getLatLonPosition = function(options) {

        var deferred = $q.defer();

        geolocationFactory.getCurrentPosition(options)
            .then(function(position) {
                deferred.resolve({'lat': position.coords.latitude, 'lon': position.coords.longitude});
            }, function(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    return geolocationFactory;

}]);
