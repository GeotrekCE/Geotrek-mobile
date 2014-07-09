'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization', ['geotrekSettings']);

geotrekGlobalization.config(['$translateProvider', 'locales', function($translateProvider, locales) {

    // Initialize app languages
    $translateProvider.translations('fr', locales['fr']);
    $translateProvider.translations('en', locales['en']);
    $translateProvider.preferredLanguage('fr');
}]);

geotrekGlobalization.service('globalizationInitService', ['$q', '$translate', 'globalizationFactory', 'settings', function($q, $translate, globalizationFactory, settings) {

    this.run = function() {

        var deferred = $q.defer();

        globalizationFactory.getPreferredLanguage()
        .then(function(language) {
            $translate.use(language || settings.DEFAULT_LANGUAGE);
            deferred.resolve(language);
        }, function(error) {
            $log.error(error);
            $translate.use(settings.DEFAULT_LANGUAGE);
            deferred.resolve(settings.DEFAULT_LANGUAGE);
        });

        return deferred.promise;
    };
}]);
