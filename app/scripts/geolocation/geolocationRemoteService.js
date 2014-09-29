'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation');

geotrekGeolocation.service('geolocationRemoteService', ['$q', '$timeout', function ($q, $timeout) {

    // There variables are used to limit watchPosition callbacks
    var iterNum = 0, maxIterNum = 10;

    this.getCurrentPosition = function(options) {

        var deferred = $q.defer();

        // On some weird cases, there is no callback on getCurrentPosition when used together with watchPosition...
        // Adding a timeout to be sure that app is not blocked on these cases
        options = options || {};
        options['timeout'] = 2 * 1000; // 2s

        // Using HTML5 geolocation API
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    deferred.resolve(position);
                }, function(positionError) {
                    deferred.reject(positionError);
              }, options);
        } else {
            deferred.reject({message: 'Your browser does not support HTML5 geolocation API.'});
        }

        return deferred.promise;
    };

    // We broadcast to scope only 1 data on each <maxIterNum> watchPosition callback
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
        var _this = this;

        if (navigator.geolocation) {
            return navigator.geolocation.watchPosition(
                function(position) {
                    _this._broadcast($scope, {'lat': position.coords.latitude, 'lng': position.coords.longitude});
                }, function(positionError) {
                    _this._broadcast($scope, positionError);
              }, options);
        } else {
            $scope.$broadcast('watchPosition', 'Your browser does not support HTML5 geolocation API.');
        }
    };

    this.clearWatch = function(watchID) {
        if (navigator.geolocation) {
            navigator.geolocation.clearWatch(watchID);
        }
    };
}]);
