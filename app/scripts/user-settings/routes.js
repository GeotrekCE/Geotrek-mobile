'use strict';

var geotrekUserSettings = angular.module('geotrekUserSettings', ['ngStorage']);

geotrekUserSettings.config(function($stateProvider) {

    $stateProvider
    .state('settings', {
        url: '/settings',
        templateUrl: 'views/user_settings.html',
        controller: 'UserSettingsController'
    });

})
.constant('networkSettings', {
    'wifi': {
        label: 'WiFi',
        value: 'wifi'
    },
    'all': {
        label: 'WiFi + 3G/4G',
        value: 'all'
    }
})
