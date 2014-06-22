/*global StatusBar*/

'use strict';

var geotrekApp = angular.module('geotrekMobileApp', ['ionic', 'ngResource', 'ui.router', 'ui.bootstrap.buttons', 'geotrekTreks', 'geotrekPois', 'geotrekMap', 'geotrekInit', 'ngCordova']);

// Wait for 'deviceready' Cordova event
window.ionic.Platform.ready(function() {
    if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }

    // Now launch the app
    angular.bootstrap(document, ['geotrekMobileApp']);
});

geotrekApp.constant('settings', {
    DOMAIN_NAME: 'http://rando.makina-corpus.net',
    POI_FILE_NAME: 'pois.geojson',
    remote: {
        TREK_REMOTE_FILE_URL_BASE: 'http://rando.makina-corpus.net/fr/files/api/trek',
        TREK_REMOTE_FILE_URL: 'http://rando.makina-corpus.net/fr/files/api/trek/trek.geojson'
    },
    device: {
        CDV_ROOT: 'cdvfile://localhost/persistent',
        CDV_TREK_ROOT: 'cdvfile://localhost/persistent/geotrek/trek',
        CDV_TREK_ROOT_FILE: 'cdvfile://localhost/persistent/geotrek/trek.geojson',
        CDV_POI_ROOT: 'cdvfile://localhost/persistent/geotrek/poi',
        RELATIVE_ROOT: 'geotrek',
        RELATIVE_TREK_ROOT: 'geotrek/trek',
        RELATIVE_TREK_ROOT_FILE: 'geotrek/trek.geojson',
        RELATIVE_POI_ROOT: 'geotrek/poi',
    }
});

geotrekApp.config(['$urlRouterProvider', '$compileProvider', function($urlRouterProvider, $compileProvider) {
    $urlRouterProvider.otherwise('/trek');
    // Root url is defined in init module

    // Add cdvfile to allowed protocols in ng-src directive
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);

}])
.run(['$rootScope', '$state', function($rootScope) {
    $rootScope.$on('$stateChangeError', function (evt, to, toParams, from, fromParams, error) {
        if (!!window.cordova) {
            if (error.message) {
                console.error('$stateChangeError : ' + error.message);
            } else {
                console.error('$stateChangeError : ' + JSON.stringify(error));
            }
        } else {
            console.error('$stateChangeError :', error);
        }
    });
}]);
