'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization', []);

geotrekGlobalization.config(['$translateProvider', 'locales', function($translateProvider, locales) {

    // Initialize app languages
    $translateProvider.translations('fr', locales['fr']);
    $translateProvider.translations('en', locales['en']);
}]);

geotrekGlobalization.service('globalizationInitService', ['$q', '$translate', 'globalizationFactory', function($q, $translate, globalizationFactory) {

    var DEFAULT_LANGUAGE = 'fr';

    this.run = function() {

        var deferred = $q.defer();

        globalizationFactory.getPreferredLanguage()
        .then(function(language) {
            $translate.use(language || DEFAULT_LANGUAGE);
            deferred.resolve(language);
        }, function(error) {
            $log.error(error);
            $translate.use(DEFAULT_LANGUAGE);
            deferred.resolve(DEFAULT_LANGUAGE);
        });

        return deferred.promise;
    };
}]);
