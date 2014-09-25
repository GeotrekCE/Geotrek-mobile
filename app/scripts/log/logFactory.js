'use strict';

var geotrekLog = angular.module('geotrekLog', []);

// README : we wanted to log JavaScript messages in a device file (for debug purpose)
// we tried to use angular decorator ($provide in module config)
// of '$log' angular built-in logging but there are some circular dependencies
// injection when using $cordovaFile in log $delegate. In fact, $cordovaFile
// has a dependence to $q, which has a dependence to ExceptionHandler
// which has a dependence to $log, ARG.
// We then defined a specific logging service.
geotrekLog.factory('logging', ['$injector', '$window', '$timeout', 'settings', function ($injector, $window, $timeout, settings) {

    var logFactory;

    // Writing logs on file only if LOGS settings is OK
    if (angular.isDefined($window.cordova) && settings.device.LOGS) {
        logFactory = $injector.get('logDeviceService');
    }
    else {
        logFactory = $injector.get('logRemoteService');
    }

    return logFactory;

}]);
