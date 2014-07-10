'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization', ['geotrekSettings', 'ngStorage']);

geotrekGlobalization.config(['$translateProvider', 'locales', function($translateProvider, locales) {

    // Initialize app languages
    $translateProvider.translations('fr', locales['fr']);
    $translateProvider.translations('en', locales['en']);
    $translateProvider.preferredLanguage('fr');
}]);

geotrekGlobalization.service('globalizationService', ['$q', '$translate', 'globalizationFactory', '$localStorage', function($q, $translate, globalizationFactory, $localStorage) {

    // Using simple localStorage module, instead of http://angular-translate.github.io/docs/#/guide/10_storages,
    // to save user language.
    // Simplier, and avoid to add angular-translate-storage-local AND angular-translate-storage-cookie
    var LOCALSTORAGE_LANGUAGE_KEY = 'current-language';

    this.init = function() {

        var deferred = $q.defer();

        // Is there an already chosen language ?
        var savedLanguage = $localStorage[LOCALSTORAGE_LANGUAGE_KEY];

        if (!!savedLanguage) {
            $translate.use(savedLanguage);
            deferred.resolve(savedLanguage);
        }
        else {
            globalizationFactory.getLanguage()
            .then(function(language) {
                $translate.use(language);
                deferred.resolve(language);
            });
        }

        return deferred.promise;
    };

    this.setLanguage = function(language) {
        $translate.use(language);
        $localStorage[LOCALSTORAGE_LANGUAGE_KEY] = language;
    };

}]);
