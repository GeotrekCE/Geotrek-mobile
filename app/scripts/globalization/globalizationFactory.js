'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization');

geotrekGlobalization.factory('globalizationFactory', ['$injector', '$window', '$q', function ($injector, $window, $q) {

    var globalizationFactory;

    if (angular.isDefined($window.cordova) && (!$window.ionic.Platform.isAndroid())) {
        globalizationFactory = $injector.get('globalizationDeviceService');
    }
    else {
        globalizationFactory = $injector.get('globalizationRemoteService');
    }

    return globalizationFactory;

}]);
