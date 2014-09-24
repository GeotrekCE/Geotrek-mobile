'use strict';

var geotrekLog = angular.module('geotrekLog');

geotrekLog.service('logRemoteService', function () {

    this.log = function(msg) {
        console.log(msg);
    };

    this.info = function(msg) {
        console.info(msg);
    };

    this.warn = function(msg) {
        console.warn(msg);
    };

    this.error = function(msg) {
        console.error(msg);
    };

    this.debug = function(msg) {
        console.debug(msg);
    };

});
