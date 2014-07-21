'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization', ['geotrekAppSettings', 'ngStorage', 'geotrekUserSettings']);

geotrekGlobalization.config(['$translateProvider', 'locales', 'globalSettings', function($translateProvider, locales, globalSettings) {

    // Initialize app languages
    $translateProvider.translations('fr', locales['fr']);
    $translateProvider.translations('en', locales['en']);
    $translateProvider.preferredLanguage(globalSettings.DEFAULT_LANGUAGE);
}]);

geotrekGlobalization.service('globalizationService', ['$q', '$translate', 'globalizationFactory', '$localStorage', 'userSettingsService', function($q, $translate, globalizationFactory, $localStorage, userSettingsService) {

    this.init = function() {
        var deferred = $q.defer();

        // Is there an already chosen language ?
        var savedLanguage = userSettingsService.getUserLanguage();

        if (!!savedLanguage) {
            $translate.use(savedLanguage);
            deferred.resolve(savedLanguage);
        }
        else {
            globalizationFactory.detectLanguage()
            .then(function(language) {
                $translate.use(language);
                deferred.resolve(language);
            });
        }

        return deferred.promise;
    };

    this.translateTo = function(language) {
        $translate.use(language);
    };

}]);
