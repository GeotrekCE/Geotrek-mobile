'use strict';

var geotrekUserSettings = angular.module('geotrekUserSettings');

geotrekUserSettings.service('userSettingsService', ['$localStorage', 'localeSettings', 'networkSettings', 'globalSettings', function ($localStorage, localeSettings, networkSettings, globalSettings) {

    var LOCALSTORAGE_USER_SETTINGS_KEY = 'user-settings';

    this.getUserLanguage = function() {

        var currentLanguage;

        try {
            currentLanguage = $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY]['currentLanguage'];
        }
        catch(e) {
        }

        return currentLanguage;
    };

    this.getUserSettings = function() {
        var userSettings = $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY];

        if (!userSettings)
            userSettings = {};
        if (!userSettings['currentLanguage']) 
            userSettings['currentLanguage'] = globalSettings.DEFAULT_LANGUAGE;
        if (!userSettings['synchronizationMode'])
            userSettings['synchronizationMode'] = 'wifi';
        if (!userSettings['alertOnPOIs']) {
            userSettings['alertOnPOIs'] = false;
        }

        return userSettings;
    };

    this.saveUserSettings = function(userSettings) {
        if (!$localStorage[LOCALSTORAGE_USER_SETTINGS_KEY]) {
            $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY] = {};
        }
        $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY]['currentLanguage'] = userSettings.currentLanguage.locale;
        $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY]['synchronizationMode'] = userSettings.synchronizationMode.value;
        $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY]['alertOnPOIs'] = userSettings.alertOnPOIs;
    };

}]);
