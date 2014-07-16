'use strict';

var geotrekUserSettings = angular.module('geotrekUserSettings');

geotrekUserSettings.service('userSettingsService', ['$localStorage', function ($localStorage) {

    var LOCALSTORAGE_USER_SETTINGS_KEY = 'user-settings';

    this.getUserSettings = function() {
        return $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY] || {};
    };

    this.saveUserSettings = function(userSettings) {
        $localStorage[LOCALSTORAGE_USER_SETTINGS_KEY] = userSettings;
    };

}]);
