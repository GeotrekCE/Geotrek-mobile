'use strict';

var geotrekUserSettings = angular.module('geotrekUserSettings');

geotrekUserSettings.controller('UserSettingsController',
    ['$rootScope', '$state', '$scope', '$ionicModal',
    function ($rootScope, $state, $scope, $ionicModal) {

    $rootScope.statename = $state.current.name;

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
