/**
 * Service that persists and retrieves static pages from data source
 */

geotrekStaticPages.service('staticPagesFileSystemService', [
    '$resource', '$rootScope', '$window', '$q', '$http', '$cordovaFile', '$log', 'settings', 'utils',
    function ($resource, $rootScope, $window, $q, $http, $cordovaFile, $log, settings, utils) {

    this.downloadStaticPages = function(url) {
        var _this = this;

        return utils.downloadFile(url, settings.device.CDV_STATIC_PAGES_ROOT_FILE)
        .then(function() {
            return _this.downloadStaticPagesPictures();
        }).catch(function(error){
            $log.error(error);
        });
    };

   this.replaceImgURLs = function(staticPagesData) {

        // Parse static page url on content, and change their URL
        angular.forEach(staticPagesData, function(pages) {
            
            // Only the content must be changed
            // TODO : parse content to change <img> urls
            pages.content = "new-" + pages.content;
        });

        return staticPagesData;
    };    

    this.downloadStaticPagesPictures = function() {
        var _this = this;

        return this.getRawStaticPages()
        .then(function(staticPages) {
            var promises = [];

            angular.forEach(staticPages, function(page) {

                angular.forEach(page.media, function(media) {
                    var mediaUrl = media.url;
                    var serverUrl = settings.DOMAIN_NAME + mediaUrl;
                    var filename = mediaUrl.substr(mediaUrl.lastIndexOf('/') + 1);

                    promises.push(utils.downloadFile(serverUrl, settings.device.CDV_STATIC_PAGES_IMG_ROOT + '/' + filename));
                });
            })

            return $q.all(promises);
        });
    };    

    // Getting treks used for mobile purpose
    // Image urls are converted to cdv://localhost/persistent/... ones
    this.getStaticPages = function() {
        var replaceUrls = true,
            deferred = $q.defer();

        this._getStaticPages(replaceUrls)
        .then(function(jsonData) {
            var staticPages = [];
            angular.forEach(jsonData, function(page) {

                staticPages.push({
                    text: page.title,
                    title: page.title,
                    description: page.content
                });
            })

            deferred.resolve(staticPages);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
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

        $cordovaFile.readAsText(filePath)
        .then(
            function(data) {
                var jsonData = JSON.parse(data);
                if (replaceUrls) {
                    jsonData = _this.replaceImgURLs(jsonData);
                }

                deferred.resolve(jsonData);

            },
            deferred.reject
        );

        return deferred.promise;
    };    

}]);
