'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.service('mapFileSystemService', ['$q', function ($q) {

    // We don't have to download Map Background in Remote version, only for device offline mode
    this.downloadGlobalBackground = function(url) {
        var deferred = $q.defer();
        deferred.resolve({message: 'We need to download map Background'});
        return deferred.promise;
    };

}]);
