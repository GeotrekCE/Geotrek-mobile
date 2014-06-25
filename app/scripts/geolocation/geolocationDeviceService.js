'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation');

geotrekGeolocation.service('geolocationDeviceService', ['$q', '$cordovaGeolocation', function ($q, $cordovaGeolocation) {

    this.getCurrentPosition = function(options) {
        return $cordovaGeolocation.getCurrentPosition(options);
    };

}]);
