'use strict';

var geotrekLog = angular.module('geotrekLog');


geotrekLog.service('logDeviceService', function ($document, $injector, settings, $timeout, $localStorage, $cordovaFile) {

    var LOCALSTORAGE_LOGS_KEY = 'logs',
        poolLogsFn;

    $localStorage[LOCALSTORAGE_LOGS_KEY] = '';

    // Cleaning log file on each app loading
    // This function will be called only once (services in AngularJS are singleton)
    $cordovaFile.removeFile(settings.device.RELATIVE_LOGS_FILE)
    .finally(function() {

        // We want to write logs on file system, but this call is asynchronous,
        // but we don't want to manage the callback on each logging call in whole app code.
        // Solution: we store logs in local storage, and on each "settings.device.LOG_POOL_TIME" seconds,
        // we write it on file, and clean logs in local storage
        poolLogsFn = $timeout(function poolLogs() {

            var writeOptions = {
                append: true
            };

            // WARNING: third parameter of writeFile is a dict added on a pull request on ngCordova
            // https://github.com/driftyco/ng-cordova/issues/325 to allow
            // appending data in an existing file with cordova
            $cordovaFile.writeFile(
                settings.device.RELATIVE_LOGS_FILE,
                $localStorage[LOCALSTORAGE_LOGS_KEY],
                writeOptions
            )
            .then(function(result) {
                $localStorage[LOCALSTORAGE_LOGS_KEY] = "";

                // Calling back the same function to emulate an infinite loop
                poolLogsFn = $timeout(poolLogs, settings.device.LOG_POOL_TIME);
            });
        }, settings.device.LOG_POOL_TIME);
    });

    // Stopping log write pooling if app is put in background
    document.addEventListener("pause", function() {
        $timeout.cancel(poolLogsFn);
    }, false);

    this._writeLog = function(msg, logPrefix) {
        // Stringify log, useful when msg is a JavaScript Object
        // Adding "\n" to add line return between each log (readability purpose)
        var msgFormatted = logPrefix + JSON.stringify(msg) + '\n';

        $localStorage[LOCALSTORAGE_LOGS_KEY] +=  msgFormatted;
    };

    this.log = function(msg) {
        console.log(msg);
        this._writeLog(msg, 'LOG: ');
    };

    this.info = function(msg) {
        console.info(msg);
        this._writeLog(msg, 'INFO: ');
    };

    this.warn = function(msg) {
        console.warn(msg);
        this._writeLog(msg, 'WARN: ');
    };

    this.error = function(msg) {
        console.error(msg);
        this._writeLog(msg, 'ERROR: ');
    };

    this.debug = function(msg) {
        console.debug(msg);
        this._writeLog(msg, 'DEBUG: ');
    };

});
