'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation');

geotrekGeolocation.service('geolocationDeviceService', ['$q', '$cordovaGeolocation', function ($q, $cordovaGeolocation) {

    this.getCurrentPosition = function(options) {
        return $cordovaGeolocation.getCurrentPosition(options);
    };

    this.watchPosition = function($scope, options) {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                function(position) {
                    $scope.$broadcast('watchPosition', {'lat': position.coords.latitude, 'lng': position.coords.longitude});
                }, function(positionError) {
                    $scope.$broadcast('watchPosition', positionError);
              }, options);
        } else {
            $scope.$broadcast('watchPosition', 'Your browser does not support HTML5 geolocation API.');
        }
    };

}]);
