'use strict';

var geotrekPois = angular.module('geotrekPois', []);

/**
 * Service that persists and retrieves treks from data source
 */
geotrekPois.factory('poisFactory', ['$injector', '$window', '$rootScope', '$q', function ($injector, $window, $rootScope, $q) {

    var poisFactory;

    if (angular.isDefined($window.cordova)) {
        poisFactory = $injector.get('poisFileSystemService');
    }
    else {
        poisFactory = $injector.get('poisRemoteService');
    }

    return poisFactory;
}]);