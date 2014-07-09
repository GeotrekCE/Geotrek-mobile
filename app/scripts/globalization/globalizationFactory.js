'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization');

geotrekGlobalization.factory('globalizationFactory', ['$injector', '$window', '$log', '$q', 'settings', function ($injector, $window, $log, $q, settings) {

    var globalizationFactory;

    if (angular.isDefined($window.cordova) && (!$window.ionic.Platform.isAndroid())) {
        globalizationFactory = $injector.get('globalizationDeviceService');
    }
    else {
        globalizationFactory = $injector.get('globalizationRemoteService');
    }

    globalizationFactory.getLanguage = function() {

        var deferred = $q.defer();

        globalizationFactory.getPreferredLanguage()
        .then(function(language) {
            // We need only 2 chars for language, but globalization can return fr-FR for example
            try {
                if (!!language) {
                    language = language.substring(0, 2);
                }
            }
            catch(e) {
                $log.error(e);
                language = settings.DEFAULT_LANGUAGE;
            }

            deferred.resolve(language);

        }, function(error) {
            deferred.resolve(settings.DEFAULT_LANGUAGE);
        });

        return deferred.promise;
    }

    return globalizationFactory;

}]);
