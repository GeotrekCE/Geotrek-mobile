'use strict';

var geotrekUserSettings = angular.module('geotrekUserSettings');

geotrekUserSettings.controller('UserSettingsController',
    ['$rootScope', '$state', '$scope', '$ionicPopup', '$translate','localeSettings', 'userSettingsService', 'networkSettings', 'globalizationService', 'mapFactory', 'logging',
    function ($rootScope, $state, $scope, $ionicPopup, $translate, localeSettings, userSettingsService, networkSettings, globalizationService, mapFactory, logging) {

    // To have a correct 2-ways binding, localeSettings and networkSettings are used for
    // 1/ select markup initialization
    $scope.languages = localeSettings;
    $scope.connections = networkSettings;
    $scope.cleanIsDisabled = false;

    // AND
    // 2/ initialize select with saved user settings
     userSettingsService.getUserSettings().then(function(userSettings){
            var scopeUserSettings = {
                currentLanguage: localeSettings[userSettings.currentLanguage],
                synchronizationMode: networkSettings[userSettings.synchronizationMode],
                alertOnPois: userSettings.alertOnPois
            };
            $scope.userSettings = scopeUserSettings;
        }
    )

    // If current language is modified, translating text
    $scope.$watch('userSettings.currentLanguage', function() {
        var chosenLanguage = $scope.userSettings.currentLanguage.locale;
        globalizationService.translateTo(chosenLanguage);
    });

    // If user settings are modified, saving them
    $scope.$watch('userSettings', function() {
        userSettingsService.saveUserSettings($scope.userSettings);
    }, true);

    $scope.cleanMaps = function() {
        $translate([
            'usersettings_controller_cleanmaps_confirm_title',
            'usersettings_controller_cleanmaps_confirm_label'
        ]).then(function(translations) {
            var confirmPopup = $ionicPopup.confirm({
                title: translations.usersettings_controller_cleanmaps_confirm_title,
                template: translations.usersettings_controller_cleanmaps_confirm_label
            });

            confirmPopup.then(function(confirmed) {
                if(confirmed) {
                    mapFactory.cleanDownloadedLayers()
                    .then(function(result) {
                        // Disabling delete button to inform user that delete is done
                        $scope.cleanIsDisabled = true;
                    }, function(error) {
                        logging.error(error);
                    });
                }
            });
        });
    };

}]);
