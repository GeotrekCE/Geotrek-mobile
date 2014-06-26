'use strict';

var geotrekApp = angular.module('geotrekMobileApp');

/**
 * Service that gives treks filters
 */

geotrekApp.factory('staticPagesFactory', function ($resource, $rootScope, $window, $q) {
    return {
        getStaticPages: function() {
            var deferred = $q.defer(),
                fakeText = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Aliquam ac egestas est. Nunc ac nisl fringilla, tristique nibh quis, fermentum dui.</p><p>Nulla sit amet sodales mauris. Praesent tristique commodo tempus. Suspendisse vel blandit mi. In neque sapien, consequat eu gravida eu, interdum nec quam. Nullam eget suscipit mi. Morbi vestibulum nisl ut nisi lacinia, ut consectetur sapien ultricies.</p>';

            // text field is used by ionic $ionicActionSheet.show() method to display menu titles
            // title and description are used in static pages template
            var pages = [
                { text: 'Page statique A', title: 'Page statique A', description: fakeText },
                { text: 'Page statique B', title: 'Page statique B', description: fakeText },
                { text: 'Page statique C', title: 'Page statique C', description: fakeText },
                { text: 'Page statique D', title: 'Page statique D', description: fakeText }
            ];

            deferred.resolve(pages);

            return deferred.promise;
        }
    };
});
