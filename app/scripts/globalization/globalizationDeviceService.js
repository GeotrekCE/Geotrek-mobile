'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization');

geotrekGlobalization.service('globalizationDeviceService', ['$q', '$cordovaGlobalization', function ($q, $cordovaGlobalization) {

    this.getPreferredLanguage = function() {

        var deferred = $q.defer(),
            preferredLanguage = $cordovaGlobalization.getPreferredLanguage();

        deferred.resolve(preferredLanguage);

        return deferred.promise;
    };

}]);
