/*global StatusBar*/

'use strict';

var geotrekApp = angular.module('geotrekMobileApp', ['ionic', 'ngResource', 'ui.router', 'ui.bootstrap.buttons', 'geotrekTreks', 'geotrekMap', 'geotrekInit', 'ngCordova']);

// Wait for 'deviceready' Cordova event
window.ionic.Platform.ready(function() {
    if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }

    // Now launch the app
    angular.bootstrap(document, ['geotrekMobileApp']);
});

geotrekApp.config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/trek');
    // Root url is defined in init module
})
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
