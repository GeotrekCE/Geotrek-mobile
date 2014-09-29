'use strict';

var geotrekNotification = angular.module('geotrekNotification');

geotrekNotification.service('notificationDeviceService', ['$q', '$timeout', function ($q, $timeout) {

    this.notify = function(msg) {
        window.plugin.notification.local.add({
            id:      1,
            title:   'Title',
            message: msg
        });
    };

}]);
