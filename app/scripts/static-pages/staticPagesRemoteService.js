/**
 * Service that persists and retrieves treks from data source
 */

geotrekStaticPages.service('staticPagesRemoteService', [
    '$resource', '$rootScope', '$window', '$q', '$http', 'settings', 'globalizationSettings',
    function ($resource, $rootScope, $window, $q, $http, settings, globalizationSettings) {

    this.getStaticPages = function() {
        var deferred = $q.defer();

        $http.get(globalizationSettings.STATIC_PAGES_URL)
        .then(function(response) {

            var staticPages = [];
            angular.forEach(response.data, function(page) {

                var content = page.content;
                // Appending DOMAIN_NAME on each image src to be correctly loaded on browser
                // (image urls in json are relative)
                content = content.replace('src="', 'src="' + settings.DOMAIN_NAME);

                staticPages.push({
                    text: page.title,
                    title: page.title,
                    description: content
                });
            })
            deferred.resolve(staticPages);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

}]);
