'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization');

geotrekGlobalization.service('globalizationDeviceService', ['$q', '$cordovaGlobalization', function ($q, $cordovaGlobalization) {

    this.getPreferredLanguage = function() {
        return $cordovaGlobalization.getPreferredLanguage();
    };

}]);
