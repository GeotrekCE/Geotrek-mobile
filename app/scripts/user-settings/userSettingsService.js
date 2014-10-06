'use strict';

var geotrekUserSettings = angular.module('geotrekUserSettings');

geotrekUserSettings.service('userSettingsService', ['$localStorage', 'localeSettings', 'networkSettings', 'globalSettings', 'globalizationFactory', '$q', function ($localStorage, localeSettings, networkSettings, globalSettings , globalizationFactory, $q) {

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
        var defer = $q.defer();
        if (!userSettings)
            userSettings = {};
        if (!userSettings['synchronizationMode'])
            userSettings['synchronizationMode'] = 'wifi';
        if (!userSettings['alertOnPois']) {
            userSettings['alertOnPois'] = false;
        }
        if (!userSettings['currentLanguage']){
            globalizationFactory.detectLanguage()
            .then(function(language) {
                userSettings['currentLanguage'] = language;
                defer.resolve(userSettings);
            });
        }
        else{
            console.log(userSettings['currentLanguage']);
            defer.resolve(userSettings);
        }
        return defer.promise;
    };

    this.saveUserSettings = function(userSettings) {
        if (!$localStorage[LOCALSTORAGE_USER_SETTINGS_KEY]) {
            $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY] = {};
        }
        $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY]['currentLanguage'] = userSettings.currentLanguage.locale;
        $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY]['synchronizationMode'] = userSettings.synchronizationMode.value;
        $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY]['alertOnPois'] = userSettings.alertOnPois;
    };

    this.warnForDownload = function() {

        var userConnectionPreference = this.getUserSettings().synchronizationMode,
            warning = false;

        // We have to warn user only if device connection is not wifi one and user only wants to use wifi
        // If we don't know the connection, we prefer to avoid to repeat warning message each time user downloads something
        if (angular.isDefined(navigator.connection)) {
            if ((navigator.connection.type != Connection.WIFI) && (userConnectionPreference == networkSettings.wifi.value)) {
                warning = true;
            }
        }

        return warning;
    };

}]);
