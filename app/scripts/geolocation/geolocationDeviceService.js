'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation');

geotrekGeolocation.service('geolocationDeviceService', ['$q', '$cordovaGeolocation', function ($q, $cordovaGeolocation) {

    // There variables are used to limit watchPosition callbacks
    var iterNum = 0, maxIterNum = 1;

    this.getCurrentPosition = function(options) {
        return $cordovaGeolocation.getCurrentPosition(options);
    };

    this._broadcast = function($scope, dataToBroadcast) {
        if (iterNum === maxIterNum) {
            $scope.$broadcast('watchPosition', dataToBroadcast);
            iterNum = 0;
        }
        else {
            iterNum += 1;
        }
    };

    this.watchPosition = function($scope, options) {
        var deferred = $q.defer(),
            watchResult = $cordovaGeolocation.watchPosition(options),
            _this = this;

        watchResult.promise
        .then(function(position) {
            _this._broadcast($scope, 'ngcordova geolocation watch uses notify, not resolve');
        }, function(positionError) {
            _this._broadcast($scope, positionError);
        }, function(position) {
            _this._broadcast($scope,  {'lat': position.coords.latitude, 'lng': position.coords.longitude});
        });

        return watchResult.watchId;
    };

    this.clearWatch = function(watchID) {
        return $cordovaGeolocation.clearWatch(watchID);
    };

}]);
