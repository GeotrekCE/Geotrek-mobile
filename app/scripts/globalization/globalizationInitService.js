'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization', ['geotrekSettings']);

geotrekGlobalization.config(['$translateProvider', 'locales', function($translateProvider, locales) {

    // Initialize app languages
    $translateProvider.translations('fr', locales['fr']);
    $translateProvider.translations('en', locales['en']);
    $translateProvider.preferredLanguage('fr');
}]);

geotrekGlobalization.service('globalizationInitService', ['$q', '$translate', 'globalizationFactory', function($q, $translate, globalizationFactory) {

    this.run = function() {

        var deferred = $q.defer();

        globalizationFactory.getLanguage()
        .then(function(language) {
            $translate.use(language);
            deferred.resolve(language);
        });

        return deferred.promise;
    };
}]);
