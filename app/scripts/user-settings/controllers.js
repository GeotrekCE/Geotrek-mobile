'use strict';

var geotrekUserSettings = angular.module('geotrekUserSettings');

geotrekUserSettings.controller('UserSettingsController',
    ['$rootScope', '$state', '$scope', '$ionicModal', 'localeSettings',
    function ($rootScope, $state, $scope, $ionicModal, localeSettings) {

    $rootScope.statename = $state.current.name;

    $scope.languages = localeSettings;
    $scope.connections = [{label:'WiFi'}, {label: 'WiFi + 3G/4G'}];

    var userSettings = {
        currentLanguage: localeSettings[0],
        downloadConnectionType: $scope.connections[0],
        alertOnPOIs: true
    };

    $scope.userSettings = userSettings;

    // Display the modal (this is the entire view here)
    $ionicModal.fromTemplateUrl('views/user_settings.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

}]);
