'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.factory('mapFactory', ['$injector', '$window', function ($injector, $window) {

    var mapFactory;

    if (angular.isDefined($window.cordova)) {
        mapFactory = $injector.get('mapFileSystemService');
    }
    else {
        mapFactory = $injector.get('mapRemoteService');
    }

    return mapFactory;
}]);