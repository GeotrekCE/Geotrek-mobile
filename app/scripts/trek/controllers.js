'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.controller('TrekController',
    ['$rootScope', '$scope', '$state', '$window', '$ionicActionSheet', '$ionicModal', 'treks', 'staticPages', 'localeSettings', 'utils', 'treksFiltersService',
     function ($rootScope, $scope, $state, $window, $ionicActionSheet, $ionicModal, treks, staticPages, localeSettings, utils, treksFiltersService) {

    $rootScope.statename = $state.current.name;

    // treks and staticPages come from TrekController routing resolve
    $rootScope.treks = treks;
    $rootScope.staticPages = staticPages;

    // Define filters from service to the scope for the view
    $scope.filtersData = treksFiltersService.getTrekFilterOptions(treks);

    // Prepare an empty object to store currently selected filters
    $scope.activeFilters = treksFiltersService.getDefaultActiveFilterValues();

    // Give access to state data to our View for active state
    $scope.$state = $state;

    // Show search input or not
    $scope.showSearch = {
        search : 0 // Hidden by default
    };

    // Filter treks everytime our filters change
    $scope.filterTreks = function (trek) {
        return treksFiltersService.filterTreks(trek, $scope.activeFilters);
    };

    $scope.resetFilters = function () {
        $scope.activeFilters = treksFiltersService.getDefaultActiveFilterValues();
    };

    $scope.cancelBtHandler = function () {
        $scope.showSearch.search = 0;
        $scope.activeFilters.search = '';
    };

    // Triggered on a button click, or some other target
    $scope.showMore = function () {
        // Show the action sheet
        $ionicActionSheet.show({
            buttons: $scope.staticPages,
            cancel: function() {

            },
            buttonClicked: function(index) {
                utils.createModal('views/static_page.html', $scope.staticPages[index]);

                return true;
            }
        });
    };

    // Watch for changes on filters, then reload the treks to keep them synced
    $scope.$watchCollection('activeFilters', function() {
        $scope.$broadcast('OnFilter');
    });
}])
.controller('TrekListController',
    ['$rootScope', '$state', '$scope', '$ionicPopup', '$q', 'mapFactory', 'treks', 'userSettingsService',
    function ($rootScope, $state, $scope, $ionicPopup, $q, mapFactory, treks, userSettingsService) {

    $rootScope.statename = $state.current.name;
    // Ordering by distance
    // If distance is not available, default ordering is trek.geojson one
    $scope.orderProp = 'distanceFromUser';

    var getTrekById = function(treks, trekId) {
        var currentTrek;
        angular.forEach(treks, function(trek) {
            if (trek.id == trekId) {
                currentTrek = trek;
                return;
            }
        });

        return currentTrek;
    };

    $scope.downloadTile = function(trekId) {

        // We prevent tile download if network is not available
        if (!$rootScope.network_available) {
            $ionicPopup.alert({
                title: 'Network cannot be reached',
                template: 'Check your network connection, needed to download trek precise maps'
            });
        }
        else {

            // Getting user connection settings, to know if we are in WiFi only mode
            var template = 'You will download precise map for this trek. Are you sure ?';
            if (userSettingsService.warnForDownload()) {
                template += '<br/><strong>Warning</strong>: you are not WiFi connected, be aware that some mobile data will be spent.';
            }

            var confirmPopup = $ionicPopup.confirm({
                title: 'Download trek map',
                template: template
            });

            var currentTrek = getTrekById(treks.features, trekId);
            currentTrek.mbtiles.realProgress = 0;
            currentTrek.mbtiles.inDownloadProgress = false;

            confirmPopup.then(function(confirmed) {
                if(confirmed) {
                    currentTrek.mbtiles.inDownloadProgress = true;
                    $q.when(mapFactory.downloadTrekPreciseBackground(trekId))
                    .then(function(result) {
                        currentTrek.mbtiles.inDownloadProgress = false;
                        currentTrek.mbtiles.isDownloaded = true;
                    }, function(error) {
                        currentTrek.mbtiles.inDownloadProgress = false;
                    }, function(progress) {
                        currentTrek.mbtiles.inDownloadProgress = true;
                        currentTrek.mbtiles.realProgress = Math.floor(progress.loaded / progress.total * 100);
                    });
                }
            });
        }
    };

    $scope.removeTile = function(trekId) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove trek map',
            template: 'Are you sure to remove trek precise map ?'
        });

        var currentTrek = getTrekById(treks.features, trekId);

        confirmPopup.then(function(confirmed) {
            if(confirmed) {
                $q.when(mapFactory.removeTrekPreciseBackground(trekId))
                .then(function(result) {
                    currentTrek.mbtiles.isDownloaded = false;
                }, function(error) {
                    $log.error(error);
                });
            }
        });
    };
}])
.controller('TrekDetailController',
    ['$rootScope', '$state', '$scope', '$ionicModal', '$stateParams', '$sce', 'trek', 'pois', 'socialSharingService',
    function ($rootScope, $state, $scope, $ionicModal, $stateParams, $sce, trek, pois, socialSharingService) {

    $rootScope.statename = $state.current.name;

    $scope.trekId = $stateParams.trekId;
    $scope.trek = trek;
    // We need to declare our json HTML data as safe using $sce
    $scope.teaser = $sce.trustAsHtml(trek.properties.description_teaser);
    $scope.pois = pois;

    // Display the modal (this is the entire view here)
    $ionicModal.fromTemplateUrl('views/trek_detail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.share = function() {
        socialSharingService.share($scope.trek.properties.name);
    };
}]);
