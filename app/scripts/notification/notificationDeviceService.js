'use strict';

var geotrekNotification = angular.module('geotrekNotification');

geotrekNotification.service('notificationDeviceService', ['$q', '$timeout', function ($q, $timeout) {

    this.notify = function(msg, title) {
        window.plugin.notification.local.add({
            id:      1,
            title:   title || 'Title',
            message: msg
        });
    };

}]);
