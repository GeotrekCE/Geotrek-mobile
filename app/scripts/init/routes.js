'use strict';

var geotrekInit = angular.module('geotrekInit', ['leaflet-directive', 'angular-loading-bar']);

geotrekInit.config(function($stateProvider) {

    $stateProvider
    .state('preload', {
        url: '',
        templateUrl: 'views/preload.html',
        controller: 'AssetsController'
    });
}).controller('AssetsController', function ($rootScope, $scope, $state, $window, $q, treksFactory, poisFactory, staticPagesFactory, cfpLoadingBar) {
    // Load everything in a promise
    //var url = "http://rando.ecrins-parcnational.fr/fr/files/api/trek/trek.geojson";
    var url = "http://rando.makina-corpus.net/fr/files/api/trek/trek.geojson";

    var promises = [];

    // Downloading treks
    promises.push(treksFactory.downloadTreks(url));

    // TODO: download treks/poi thumbnails

    // download static pages
    promises.push(staticPagesFactory.getStaticPages());

    // TODO: download map background (mbtiles)
    promises.push(treksFactory.getTreks());

    // Waiting end of each previous operation to redirect to homepage
    $q.all(promises).then(function(data) {

        // Save data to rootScope for later use
        var treks = data[2];
        $rootScope.treks = treks;
        $rootScope.staticPages = data[1];

        var trekIds = [];
        angular.forEach(treks.features, function(trek) {
            trekIds.push(trek.id);
        });

        // Downloading Trek POIs
        poisFactory.downloadPois(trekIds)
        .then(function(result) {

            cfpLoadingBar.complete();

            // Move on
            $state.go('home.trek');
        });

    });

});
