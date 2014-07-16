'use strict';

var geotrekUserSettings = angular.module('geotrekUserSettings', ['ngStorage']);

geotrekUserSettings.config(function($stateProvider) {

    $stateProvider
    .state('settings', {
        url: '/settings',
        controller: 'UserSettingsController'
    });

});
