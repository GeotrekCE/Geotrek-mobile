'use strict';

var geotrekInit = angular.module('geotrekInit', ['leaflet-directive', 'angular-loading-bar']);

geotrekInit.config(function($stateProvider) {

    $stateProvider
    .state('preload', {
        url: '',
        templateUrl: 'views/preload.html',
        controller: 'AssetsController'
    });
}).controller('AssetsController', function ($rootScope, $scope, $state, $window, $q, treksFactory, staticPagesFactory, cfpLoadingBar) {
    // Load everything in a promise
    var url = "http://rando.ecrins-parcnational.fr/fr/files/api/trek/trek.geojson";

    var promises = [];

    // Downloading treks
    promises.push(treksFactory.downloadTreks(url));

    // TODO: download POIs

    // TODO: download treks/poi thumbnails

    // TODO: download static pages
    promises.push(staticPagesFactory.getStaticPages());

    // TODO: download map background (mbtiles)

    promises.push(treksFactory.getTreks());

    // Waiting end of each previous operation to redirect to homepage
    $q.all(promises).then(function(data) {
        // Save data to rootScope for later use
        console.log(data);

        $rootScope.treks = data[2];
        $rootScope.staticPages = data[1];

        cfpLoadingBar.complete();

        // Move on
        $state.go('home.trek');
    });

});
