'use strict';

var geotrekLog = angular.module('geotrekLog');

geotrekLog.service('logDeviceService', function ($injector, settings) {

    var $cordovaFile;

    this._writeLog = function(msg) {
        // There is some weird circular dependency when injecting $cordovaFile on service function
        // Doing it manually so, if not defined, according to
        // http://stackoverflow.com/questions/22908508/angularjs-circular-dependency
        if (!$cordovaFile) {
            $cordovaFile = $injector.get('$cordovaFile');
        }

        // WARNING: third parameter of writeFile is a dict added on a pull request on ngCordova
        // https://github.com/driftyco/ng-cordova/issues/325 to allow
        // appending data in an existing file with cordova
        var writeOptions = {
            append: true
        };
        $cordovaFile.writeFile(
            settings.device.RELATIVE_LOGS_FILE,
            // Adding "\n" to add line return between each log (readability purpose)
            msg + "\n",
            writeOptions
        );
    }

    this.log = function(logFunction, msg) {
        logFunction(msg);
        this._writeLog(msg);
    };

    this.info = function(logFunction, msg) {
        logFunction(msg);
        this._writeLog(msg);
    };

    this.warn = function(logFunction, msg) {
        logFunction(msg);
        this._writeLog(msg);
    };

    this.error = function(logFunction, msg) {
        logFunction(msg);
        this._writeLog(msg);
    };

    this.debug = function(logFunction, msg) {
        logFunction(msg);
        this._writeLog(msg);
    };

});
