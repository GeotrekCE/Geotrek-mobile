/*global StatusBar*/

'use strict';

var geotrekApp = angular.module('geotrekMobileApp',
    ['ionic', 'ngResource', 'ngSanitize', 'ui.router', 'ui.bootstrap.buttons', 'geotrekTreks',
     'geotrekPois', 'geotrekMap', 'geotrekInit', 'geotrekGeolocation', 'ngCordova',
     'geotrekGlobalization', 'geotrekAppSettings', 'geotrekUserSettings', 'geotrekStaticPages',
     // angular-translate module for i18n/l10n (http://angular-translate.github.io/)
     'pascalprecht.translate']);

// Wait for 'deviceready' Cordova event
window.ionic.Platform.ready(function() {
    if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }

    // Now launch the app
    try {
        angular.bootstrap(document, ['geotrekMobileApp']);
    }
    catch(e) {
        console.log(e);
        if (!!e.message) {
            console.log(e.message);
        }
    }

});

geotrekApp.config(['$urlRouterProvider', '$compileProvider', '$logProvider',
    function($urlRouterProvider, $compileProvider, $logProvider) {

    $urlRouterProvider.otherwise('/trek');
    // Root url is defined in init module

    $logProvider.debugEnabled = true;

    // Add cdvfile to allowed protocols in ng-src directive
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
}])
.run(['$rootScope', '$log', '$window', '$state', function($rootScope, $log, $window, $state) {
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

    $rootScope.$on('$stateChangeSuccess', function (evt, to, toParams, from, fromParams, error) {
        // Adding state current name on html body markup to design some elements according to current state.
        $rootScope.statename = $state.current.name;
    });

    $rootScope.network_available = true;

    function onlineCallback() {
        $log.info('online');
        $rootScope.network_available = true;
        $rootScope.$digest();
    }

    function offlineCallback() {
        $log.info('offline');
        $rootScope.network_available = false;
        $rootScope.$digest();
    }

    document.addEventListener("online", onlineCallback, false);
    document.addEventListener("offline", offlineCallback, false);

    // Define utils variables for specific device behaviours
    $rootScope.isAndroid = $window.ionic.Platform.isAndroid() || $window.ionic.Platform.platforms[0] === 'browser';
    $rootScope.isIOS = $window.ionic.Platform.isIOS();
}]);
