'use strict';

var geotrekNotification = angular.module('geotrekNotification');

geotrekNotification.service('notificationRemoteService', ['$q', '$timeout', function ($q, $timeout) {

    this.notify = function(msg) {
        console.log(msg);
    };

}]);
