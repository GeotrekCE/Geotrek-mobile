'use strict';

var geotrekLog = angular.module('geotrekLog');

geotrekLog.service('logDeviceService', function () {

    this.log = function(logFunction, msg) {
        logFunction(msg);
    };

    this.info = function(logFunction, msg) {
        logFunction(msg);
    };

    this.warn = function(logFunction, msg) {
        logFunction(msg);
    };

    this.error = function(logFunction, msg) {
        logFunction(msg);
    };

    this.debug = function(logFunction, msg) {
        logFunction(msg);
    };

});
