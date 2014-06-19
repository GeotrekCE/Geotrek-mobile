'use strict';

var geotrekTreks = angular.module('geotrekTreks');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekTreks.factory('treksFactory', ['$injector', '$window', '$rootScope', '$q', function ($injector, $window, $rootScope, $q) {

    var treksFactory;

    if (angular.isDefined($window.cordova)) {
        treksFactory = $injector.get('treksFileSystemService');
    }
    else {
        treksFactory = $injector.get('treksRemoteService');
    }

    treksFactory.getTrek = function(_trekId) {
        var trekId = parseInt(_trekId);
        var trek;

        if (angular.isDefined($rootScope.treks)) {
            var deferred = $q.defer();

            angular.forEach($rootScope.treks.features, function(_trek) {
                if (_trek.id === trekId) {
                    trek = _trek;
                    return;
                }
            });

            deferred.resolve(trek);
            return deferred.promise;
        } else {
            return treksFactory.getTreks().then(function(treks) {
                angular.forEach(treks.features, function(_trek) {
                    if (_trek.id === trekId) {
                        trek = _trek;
                        return;
                    }
                });

                return trek;
            });
        }
    };

    return treksFactory;
}]);