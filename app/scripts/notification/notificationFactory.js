'use strict';

var geotrekNotification = angular.module('geotrekNotification', []);

geotrekNotification.factory('notificationFactory', ['$injector', '$window', function ($injector, $window) {

    var notificationFactory;

    if (angular.isDefined($window.cordova)) {
        notificationFactory = $injector.get('notificationDeviceService');
    }
    else {
        notificationFactory = $injector.get('notificationRemoteService');
    }

    return notificationFactory;

}]);
