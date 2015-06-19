'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization');

geotrekGlobalization.factory('globalizationFactory', ['$injector', '$window', 'logging', '$q', 'globalSettings', function ($injector, $window, logging, $q, globalSettings) {

    var globalizationFactory;

    if (angular.isDefined($window.cordova) && (!$window.ionic.Platform.isAndroid())) {
        globalizationFactory = $injector.get('globalizationDeviceService');
    }
    else {
        globalizationFactory = $injector.get('globalizationRemoteService');
    }

    globalizationFactory.detectLanguage = function() {

        var deferred = $q.defer();

        globalizationFactory.getPreferredLanguage()
        .then(function(language) {
            // We need only 2 chars for language, but globalization can return fr-FR for example
            try {
                if (!!language) {
                    if (typeof language !== 'string') {
                        language = language.value;
                    }
                    language = language.substring(0, 2);
                }

                if (globalSettings.AVAILABLE_LANGUAGES.indexOf(language) === -1) {
                    language = globalSettings.DEFAULT_LANGUAGE;
                }
            }
            catch(e) {
                logging.error(e);
                language = globalSettings.DEFAULT_LANGUAGE;
            }

            deferred.resolve(language);

        }, function(error) {
            deferred.resolve(globalSettings.DEFAULT_LANGUAGE);
        });

        return deferred.promise;
    }

    return globalizationFactory;

}]);
