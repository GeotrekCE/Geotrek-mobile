'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.controller('TrekController',
    ['$rootScope', '$scope', '$state', '$window', '$ionicActionSheet', '$ionicModal', '$timeout','logging', 'treks', 'staticPages', 'localeSettings', 'utils', 'treksFiltersService', 'treksFactory',
     function ($rootScope, $scope, $state, $window, $ionicActionSheet, $ionicModal, $timeout, logging, treks, staticPages, localeSettings, utils, treksFiltersService, treksFactory) {

    // treks and staticPages come from TrekController routing resolve
    $rootScope.treks = treks;
    $rootScope.staticPages = staticPages;
    $rootScope.filteredTreks = treks.features;

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

    $rootScope.sanitizeData = utils.sanitizeData;

    // Filter treks everytime our filters change
    $scope.filterTreks = function () {
        $rootScope.filteredTreks = treksFiltersService.filterTreks(treks.features, $scope.activeFilters);
    };

    $scope.resetFilters = function () {
        angular.forEach(['duration', 'elevation'], function(field){
            angular.forEach($scope.activeFilters[field], function(value, key) {
                $scope.activeFilters[field][key].checked = false;
            });
        });
        angular.forEach($scope.activeFilters['difficulty'], function(value, key) {
            $scope.activeFilters['difficulty'][key] = false;
        });
        angular.forEach($scope.activeFilters['use'], function(value, key) {
            $scope.activeFilters['use'][key] = false;
        });
        $scope.activeFilters.download =     undefined;
        $scope.activeFilters.theme =        undefined;
        $scope.activeFilters.municipality = null;
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
    $scope.$watch('activeFilters', function(newValue, oldValue) {
        $scope.filterTreks();
        $rootScope.$broadcast('OnFilter');
    },true);
}])
.controller('TrekListController',
    ['$rootScope', '$state', '$scope', '$ionicPopup', '$q', '$translate', 'mapFactory', 'treks', 'userSettingsService',
    function ($rootScope, $state, $scope, $ionicPopup, $q, $translate, mapFactory, treks, userSettingsService) {

    // Ordering by distance
    // If distance is not available, default ordering is by name
    $scope.orderByDistanceIfAvailable = function (trek) {
        if (trek.distanceFromUser) {
            return parseInt(trek.distanceFromUser);
        }
        return trek.properties.name;
    };

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

}])
.controller('TrekDetailController',
    ['$rootScope', '$state', '$scope', '$timeout', '$ionicModal', '$q', 'mapFactory', 'settings', '$ionicPopup', '$ionicScrollDelegate', '$stateParams', '$window', '$translate', '$sce', 'trek', 'pois', 'touristics', 'utils', 'socialSharingService', 'treksFactory', 'poisFactory', 'userSettingsService',
    function ($rootScope, $state, $scope, $timeout, $ionicModal, $q, mapFactory, settings, $ionicPopup, $ionicScrollDelegate, $stateParams, $window, $translate, $sce, trek, pois, touristics, utils, socialSharingService, treksFactory, poisFactory, userSettingsService) {
    $scope.activateElevation = settings.ACTIVE_ELEVATION;

    $scope.childrenCollapse = true;
    $scope.parentCollapse = true;
    $scope.poiCollapse = true;
    $scope.touristicCollapse = [];
    var collapsers_settings = settings.DETAIL_COLLAPSER_DEFAULT_OPENED;
    for (var i = 0; i < touristics.length; i++) {
        var id = touristics[i].id;
        var value = collapsers_settings.indexOf(id) > -1 ? false : true;
        $scope.touristicCollapse[id] = value;
    }
    if (collapsers_settings) {
        for (var j = 0; j < collapsers_settings.length; j++) {
            $scope[collapsers_settings[j] + 'Collapse'] = false;
        }
    }

    $scope.network_available = $rootScope.network_available;

    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.isSVG = utils.isSVG;
    $scope.trekId = $stateParams.trekId;
    $scope.trek = trek;
    $scope.children = [];
    angular.forEach(trek.properties.children, function (child) {
        treksFactory.getTrek(child)
            .then(
                function (childData) {
                    $scope.children.push(childData);
                }
            );
    });
    if (trek.properties.previous) {
        treksFactory.getTrek(trek.properties.previous)
            .then(
                function (previousData) {
                    $scope.previous = previousData;
                }
            );
    }
    if (trek.properties.next) {
        treksFactory.getTrek(trek.properties.next)
            .then(
                function (nextData) {
                    $scope.next = nextData;
                }
            );
    }
    if (trek.properties.parent) {
        treksFactory.getTrek(trek.properties.parent)
            .then(
                function (parentData) {
                    $scope.parent = parentData;
                }
            );
    }

    // We need to declare our json HTML data as safe using $sce
    $scope.teaser = $sce.trustAsHtml(trek.properties.description_teaser);
    $scope.mainDescription = $sce.trustAsHtml(trek.properties.description);
    $scope.pois = pois;
    $scope.touristics = touristics;

    // get distance to treks and pois
    treksFactory.getTrekDistance($scope.trek).then(function(userPosition) {
        poisFactory.getPoisDistance($scope.pois, userPosition);
    });

    // Display the modal (this is the entire view here)
    $ionicModal.fromTemplateUrl('views/trek_detail.html', {
        scope: $scope,
        animation: 'no-animation'
    }).then(function(modal) {

        utils.openLinkInSystemBrowser('.trek-detail p');

        $scope.modal = modal;
        $scope.modal.show();
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.toggleCollapse = function (toggleName) {
        $scope[toggleName] = !$scope[toggleName];
        $timeout(function () {
            $ionicScrollDelegate.$getByHandle('modalScroll').resize();
        }, 500);
    };

    $scope.toggleTouristicCollapse = function (touristicId) {
        $scope.touristicCollapse[touristicId] = !$scope.touristicCollapse[touristicId];
        $timeout(function () {
            $ionicScrollDelegate.$getByHandle('modalScroll').resize();
        }, 500);
    };

    $scope.back = function() {
        $window.history.go(-1);
    }

    $scope.share = function() {
        socialSharingService.share($scope.trek.properties.name+' : ', $scope.trek.properties.name, null, settings.PUBLIC_WEBSITE + '/' + $scope.trek.properties.slug);
    };

    $scope.downloadFiles = function() {
        $translate([
            'trek_controller_no_network_title',
            'trek_controller_no_network_label',
            'trek_controller_download_confirm_message',
            'trek_controller_donwload_warning_title',
            'trek_controller_donwload_warning_message',
            'trek_controller_download_confirm_title',
            'trek_controller_donwload_cancel'
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
                    cancelText: translations.trek_controller_donwload_cancel,
                    title: translations.trek_controller_download_confirm_title,
                    template: template
                });

                var loadCounter = [0,0],
                    imgLoaded = false,
                    tilesLoaded = false;

                var currentTrek = trek;
                    currentTrek.tiles.realProgress = 0;
                    currentTrek.tiles.inDownloadProgress = false;

                return confirmPopup.then(function(confirmed) {
                    if(confirmed) {
                        var dlPercent = 0,
                            hasDownloadedButNotUnzipped = [false, false];
                        currentTrek.tiles.inDownloadProgress = true;
                        return $q.all([
                            mapFactory.downloadTrekPreciseBackground($scope.trekId)
                            .then(
                                function(resultTiles){
                                    imgLoaded = true;
                                }, function(error) {
                                    currentTrek.tiles.inDownloadProgress = false;
                                }, function(progress) {
                                    currentTrek.tiles.inDownloadProgress = true;
                                    loadCounter[0] = Math.floor((progress.loaded / progress.total * 100) / 4);
                                    currentTrek.tiles.realProgress = dlPercent + loadCounter[0] + loadCounter[1];
                                    if (loadCounter[0] >= 25 && dlPercent < 50 && !hasDownloadedButNotUnzipped[0]) {
                                        hasDownloadedButNotUnzipped[0] = true;
                                        dlPercent += 25;
                                    }
                                }
                            ),
                            treksFactory.downloadTrekDetails($scope.trekId)
                            .then(
                                function(resultImgs) {
                                    tilesLoaded = true;
                                }, function(error) {
                                    currentTrek.tiles.inDownloadProgress = false;
                                }, function(progress) {
                                    currentTrek.tiles.inDownloadProgress = true;
                                    loadCounter[1] = Math.floor((progress.loaded / progress.total * 100) / 4);
                                    currentTrek.tiles.realProgress = dlPercent + loadCounter[0] + loadCounter[1];
                                    if (loadCounter[1] >= 25 && dlPercent < 50 && !hasDownloadedButNotUnzipped[1]) {
                                        hasDownloadedButNotUnzipped[1] = true;
                                        dlPercent += 25;
                                    }
                                }
                            )

                        ])
                        .then(
                            function(resultGlobal) {

                                if (imgLoaded && tilesLoaded) {
                                    currentTrek.tiles.inDownloadProgress = false;
                                    currentTrek.tiles.isDownloaded = true;
                                    treksFactory.getTreks()
                                    .then(
                                        function(trekCollection) {
                                            $rootScope.treks = trekCollection;
                                        }, function(errorMsg) {
                                            console.error(errorMsg);
                                        }
                                    );
                                }else {
                                    var isWrong = '';
                                    if (!imgLoaded) {
                                        isWrong = 'images';
                                    }
                                    if (!TilesLoaded) {
                                        isWrong = 'tiles';
                                    }
                                    if (!TilesLoaded && !imgLoaded) {
                                        isWrong = 'images and tiles';
                                    }

                                    currentTrek.tiles.inDownloadProgress = false;
                                    console.error('issue with download of ' + isWrong);
                                }

                            }, function(error) {
                                currentTrek.tiles.inDownloadProgress = false;
                            }
                        );

                    }
                });
            }
        });
    };

}]);
