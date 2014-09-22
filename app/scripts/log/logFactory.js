'use strict';

var geotrekLog = angular.module('geotrekLog', []);


geotrekLog.config(function($provide) {
    $provide.decorator('$log', function($delegate, $sniffer, logFactory) {

        var methodsToWrap = ['log', 'info', 'warn', 'error', 'debug'];

        angular.forEach(methodsToWrap, function(method) {
            var _method = $delegate[method];
            // Replacing the original behavior and including the original
            $delegate[method] = function(msg) { 
                logFactory[method](_method, msg);
            };
        });

        return $delegate;
    });
});

geotrekLog.factory('logFactory', ['$injector', '$window', function ($injector, $window) {

    var logFactory;

    if (angular.isDefined($window.cordova)) {
        logFactory = $injector.get('logDeviceService');
    }
    else {
        logFactory = $injector.get('logRemoteService');
    }

    return logFactory;

}]);
