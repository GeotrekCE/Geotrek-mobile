'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation');

geotrekGeolocation.service('geolocationDeviceService', ['$q', '$cordovaGeolocation', function ($q, $cordovaGeolocation) {

    var itemNum = 0, maxIterNum = 10;

    this.getCurrentPosition = function(options) {
        return $cordovaGeolocation.getCurrentPosition(options);
    };

    this._broadcast = function($scope, dataToBroadcast) {
        console.log('Iter Num : ' + itemNum.toString());
        if (itemNum === 10) {
            $scope.$broadcast('watchPosition', dataToBroadcast);
            itemNum = 0;
        }
        else {
            itemNum += 1;
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
