'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation');

geotrekGeolocation.service('geolocationDeviceService', ['$q', '$cordovaGeolocation', function ($q, $cordovaGeolocation) {

    this.getCurrentPosition = function(options) {
        return $cordovaGeolocation.getCurrentPosition(options);
    };

    this.watchPosition = function($scope, options) {

        var deferred = $q.defer(),
            watchResult = $cordovaGeolocation.watchPosition(options);

        watchResult.promise
        .then(function(position) {
            $scope.$broadcast('watchPosition', 'ngcordova geolocation watch uses notify, not resolve');
        }, function(positionError) {
            $scope.$broadcast('watchPosition', positionError);
        }, function(position) {
            $scope.$broadcast('watchPosition', {'lat': position.coords.latitude, 'lng': position.coords.longitude});
        });

        return watchResult.watchId;
    };

    this.clearWatch = function(watchID) {
        return $cordovaGeolocation.clearWatch(watchID);
    };

}]);
