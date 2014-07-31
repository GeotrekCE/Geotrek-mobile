'use strict';

var geotrekUserSettings = angular.module('geotrekUserSettings');

geotrekUserSettings.controller('UserSettingsController',
    ['$rootScope', '$state', '$scope', '$ionicModal', 'localeSettings', 'userSettingsService', 'networkSettings', 'globalizationService', 'mapFactory',
    function ($rootScope, $state, $scope, $ionicModal, localeSettings, userSettingsService, networkSettings, globalizationService, mapFactory) {

    // To have a correct 2-ways binding, localeSettings and networkSettings are used for
    // 1/ select markup initialization
    $scope.languages = localeSettings;
    $scope.connections = networkSettings;
    $scope.cleanIsDisabled = false;

    // AND
    // 2/ initialize select with saved user settings
    var userSettings = userSettingsService.getUserSettings();
    var scopeUserSettings = {
        currentLanguage: localeSettings[userSettings.currentLanguage],
        synchronizationMode: networkSettings[userSettings.synchronizationMode],
        alertOnPOIs: userSettings.alertOnPOIs
    };

    $scope.userSettings = scopeUserSettings;

    // Display the modal (this is the entire view here)
    $ionicModal.fromTemplateUrl('views/user_settings.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

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
        mapFactory.cleanDownloadedLayers()
        .then(function(result) {
            // Disabling delete button to inform user that delete is done
            $scope.cleanIsDisabled = true;
        }, function(error) {
            $log.error(error);
        });
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

}]);
