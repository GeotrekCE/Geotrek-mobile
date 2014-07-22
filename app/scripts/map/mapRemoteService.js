'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.service('mapRemoteService', ['$q', function ($q) {

    // We don't have to download Map Background in Remote version, only for device offline mode
    this.downloadGlobalBackground = function(url) {
        var deferred = $q.defer();
        deferred.resolve({message: 'No need to download map Background in browser mode'});
        return deferred.promise;
    };

}]);
