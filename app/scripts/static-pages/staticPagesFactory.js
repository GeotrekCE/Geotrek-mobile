'use strict';

var geotrekStaticPages = angular.module('geotrekStaticPages', []);

/**
 * Service that gives treks filters
 */
geotrekStaticPages.factory('staticPagesFactory', ['$injector', '$window', function ($injector, $window) {

    var staticPagesFactory;

    if (angular.isDefined($window.cordova)) {
        staticPagesFactory = $injector.get('staticPagesFileSystemService');
    }
    else {
        staticPagesFactory = $injector.get('staticPagesRemoteService');
    }

    return staticPagesFactory;
}]);
