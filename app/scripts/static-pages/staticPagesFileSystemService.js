/**
 * Service that persists and retrieves static pages from data source
 */

geotrekStaticPages.service('staticPagesFileSystemService', [
    '$resource', '$rootScope', '$window', '$q', '$http', '$cordovaFile', 'settings',
    function ($resource, $rootScope, $window, $q, $http, $cordovaFile, settings) {

    this.downloadStaticPages = function(url) {
        var _this = this;

        return utils.downloadFile(url, settings.device.CDV_STATIC_PAGES_ROOT_FILE)
        .then(function() {
            return _this.downloadStaticPagesPictures();
        });
    };

   this.replaceImgURLs = function(staticPagesData) {
        var copy = angular.copy(staticPagesData, {});

        // Parse static page url on content, and change their URL
        angular.forEach(copy, function(pages) {
            
            // Only the content must be changed
            var content = pages.content;
        });
        return copy;
    };    

    this.downloadStaticPagesPictures = function() {

        var _this = this;

        return this.getRawStaticPages()
        .then(function(staticPages) {
            var promises = [];

            angular.forEach(staticPages, function(page) {
                
                angular.forEach(staticPages.media, function(media) {
                    var pictureUrl = picture.url;
                    var serverUrl = settings.DOMAIN_NAME + pictureUrl;
                    var filename = pictureUrl.substr(pictureUrl.lastIndexOf('/') + 1);

                    promises.push(utils.downloadFile(serverUrl, settings.device.CDV_STATIC_PAGES_IMG_ROOT + '/' + filename));
                });
            })

            return $q.all(promises);
        });
    };    

    // Getting treks used for mobile purpose
    // Image urls are converted to cdv://localhost/persistent/... ones
    this.getStaticPages = function() {
        var replaceUrls = true;
        return this._getStaticPages(replaceUrls);
    };

    // Getting server trek original data
    this.getRawStaticPages = function() {
        var replaceUrls = false;
        return this._getStaticPages(replaceUrls);
    };

    this._getStaticPages = function(replaceUrls) {

        var filePath = settings.device.RELATIVE_STATIC_PAGES_ROOT_FILE,
            deferred = $q.defer(),
            _this = this;

        $cordovaFile.readFile(filePath)
        .then(
            function(data) {
                var jsonData = JSON.parse(data);
                if (replaceUrls) {
                    jsonData = _this.replaceImgURLs(jsonData);
                }

                var staticPages = [];
                angular.forEach(jsonData, function(page) {

                    staticPages.push({
                        text: page.title,
                        title: page.title,
                        description: page.content
                    });
                })
                deferred.resolve(staticPages);

            },
            deferred.reject
        );

        return deferred.promise;
    };    

}]);
