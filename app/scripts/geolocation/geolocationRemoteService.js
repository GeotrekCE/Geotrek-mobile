'use strict';

var geotrekGeolocation = angular.module('geotrekGeolocation');

geotrekGeolocation.service('geolocationRemoteService', ['$q', function ($q) {

    this.getCurrentPosition = function(options) {

        var deferred = $q.defer();

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
