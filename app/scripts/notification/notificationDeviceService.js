'use strict';

var geotrekNotification = angular.module('geotrekNotification');

geotrekNotification.service('notificationDeviceService', ['$q', '$timeout', function ($q, $timeout) {
    var id = 0;
    this.notify = function(msg, title) {
        id = id + 1;
        window.plugin.notification.local.schedule({
            id:      id,
            title:   title || 'Title',
            text:    msg,
        });
    };

}]);
