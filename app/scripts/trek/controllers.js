'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.controller('TrekController',
    ['$rootScope', '$scope', '$state', '$window', '$ionicActionSheet', '$ionicModal', '$timeout','logging', 'treks', 'staticPages', 'localeSettings', 'utils', 'treksFiltersService', 'treksFactory',
     function ($rootScope, $scope, $state, $window, $ionicActionSheet, $ionicModal, $timeout,logging, treks, staticPages, localeSettings, utils, treksFiltersService, treksFactory) {

    // treks and staticPages come from TrekController routing resolve
    $rootScope.treks = treks;
    $rootScope.staticPages = staticPages;

    // get distance to treks
    treksFactory.getTreksDistance($rootScope.treks);

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

        angular.forEach(['difficulty', 'duration', 'elevation'], function(field){
            angular.forEach($scope.activeFilters[field], function(value, key) {
                $scope.activeFilters[field][key].checked = false;
            });
        });
        $scope.activeFilters.download =     undefined;
        $scope.activeFilters.theme =        undefined;
        $scope.activeFilters.municipality = null;
        $scope.activeFilters.use =          null;
        $scope.activeFilters.valley =       null;
        $scope.activeFilters.route =        null;
        $scope.activeFilters.search =       '';
    };

    $scope.clearSearch = function () {
        $scope.activeFilters.search = '';
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
    ['$rootScope', '$state', '$scope', '$ionicPopup', '$q', '$translate', 'mapFactory', 'treks', 'userSettingsService',
    function ($rootScope, $state, $scope, $ionicPopup, $q, $translate, mapFactory, treks, userSettingsService) {

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
        $translate([
            'trek_controller_no_network_title',
            'trek_controller_no_network_label',
            'trek_controller_download_confirm_message',
            'trek_controller_donwload_warning_title',
            'trek_controller_donwload_warning_message',
            'trek_controller_download_confirm_title'
        ]).then(function(translations) {
            // We prevent tile download if network is not available
            if (!$rootScope.network_available) {
                $ionicPopup.alert({
                    title: translations.trek_controller_no_network_title,
                    template: translations.trek_controller_no_network_label
                });
            }
            else {

                // Getting user connection settings, to know if we are in WiFi only mode
                var template = translations.trek_controller_download_confirm_message;
                if (userSettingsService.warnForDownload()) {
                    template += '<br/><strong>' + translations.trek_controller_donwload_warning_title +'</strong>: ' + translations.trek_controller_donwload_warning_message;
                }

                var confirmPopup = $ionicPopup.confirm({
                    title: translations.trek_controller_download_confirm_title,
                    template: template
                });

                var currentTrek = getTrekById(treks.features, trekId);
                currentTrek.tiles.realProgress = 0;
                currentTrek.tiles.inDownloadProgress = false;

                confirmPopup.then(function(confirmed) {
                    if(confirmed) {
                        currentTrek.tiles.inDownloadProgress = true;
                        $q.when(mapFactory.downloadTrekPreciseBackground(trekId))
                        .then(function(result) {
                            currentTrek.tiles.inDownloadProgress = false;
                            currentTrek.tiles.isDownloaded = true;
                        }, function(error) {
                            currentTrek.tiles.inDownloadProgress = false;
                        }, function(progress) {
                            currentTrek.tiles.inDownloadProgress = true;
                            currentTrek.tiles.realProgress = Math.floor(progress.loaded / progress.total * 100);
                        });
                    }
                });
            }
        });
    };
}])
.controller('TrekDetailController',
    ['$rootScope', '$state', '$scope', '$ionicModal', '$stateParams', '$window', '$sce', 'trek', 'pois', 'socialSharingService', 'treksFactory', 'poisFactory',
    function ($rootScope, $state, $scope, $ionicModal, $stateParams, $window, $sce, trek, pois, socialSharingService, treksFactory, poisFactory) {

    $scope.trekId = $stateParams.trekId;
    $scope.trek = trek;
    
    // We need to declare our json HTML data as safe using $sce
    $scope.teaser = $sce.trustAsHtml(trek.properties.description_teaser);
    $scope.pois = pois;

    // get distance to treks and pois
    treksFactory.getTrekDistance($scope.trek).then(function(userPosition) {
        poisFactory.getPoisDistance($scope.pois, userPosition);
    });

    // Display the modal (this is the entire view here)
    $ionicModal.fromTemplateUrl('views/trek_detail.html', {
        scope: $scope,
        animation: 'no-animation'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.back = function() {
        $window.history.go(-1);
    }

    $scope.share = function() {
        socialSharingService.share($scope.trek.properties.name);
    };

}]);
