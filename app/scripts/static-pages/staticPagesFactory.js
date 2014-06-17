'use strict';

var geotrekApp = angular.module('geotrekMobileApp');

/**
 * Service that gives treks filters
 */

geotrekApp.factory('staticPagesFactory', function ($resource, $rootScope, $window, $q) {
    return {
        getStaticPages: function() {
            var deferred = $q.defer();
            var pages = [
                { text: 'Page statique A' },
                { text: 'Page statique B' },
                { text: 'Page statique C' },
                { text: 'Page statique D' }
            ];

            deferred.resolve(pages);

            return deferred.promise;
        }
    };
});
