'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.controller('TrekController',
    ['$rootScope', '$scope', '$state', '$window', '$ionicActionSheet', '$ionicModal', '$timeout', '$ionicScrollDelegate', 'logging', 'treks', 'staticPages', 'localeSettings', 'utils', 'treksFiltersService', 'treksFactory',
     function ($rootScope, $scope, $state, $window, $ionicActionSheet, $ionicModal, $timeout, $ionicScrollDelegate, logging, treks, staticPages, localeSettings, utils, treksFiltersService, treksFactory) {

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
        // Reset scroll each time we filtered
        $ionicScrollDelegate.$getByHandle('trekListScroll').scrollTop();
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
        $scope.activeFilters.accessibility =        null;
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
.controller('TrekListController', ['$scope',
    function ($scope) {

        // Ordering by distance
        // If distance is not available, default ordering is by name
        $scope.orderByDistanceIfAvailable = function (trek) {
            if (trek.distanceFromUser) {
                return parseInt(trek.distanceFromUser);
            }
            return trek.properties.name;
        };

    }
])
.controller('TrekDetailController', [
    '$rootScope',
    '$state',
    '$scope',
    '$timeout',
    '$q',
    '$stateParams',
    '$sce',
    '$translate',
    '$ionicModal',
    '$ionicPopup',
    '$ionicScrollDelegate',
    'trek',
    'pois',
    'touristics',
    'settings',
    'utils',
    'mapFactory',
    'socialSharingService',
    'treksFactory',
    'poisFactory',
    'userSettingsService',
    function (
        $rootScope,
        $state,
        $scope,
        $timeout,
        $q,
        $stateParams,
        $sce,
        $translate,
        $ionicModal,
        $ionicPopup,
        $ionicScrollDelegate,
        trek,
        pois,
        touristics,
        settings,
        utils,
        mapFactory,
        socialSharingService,
        treksFactory,
        poisFactory,
        userSettingsService) {

        function initCollapser () {
            var collapsers_settings = settings.DETAIL_COLLAPSER_DEFAULT_OPENED;

            $scope.childrenCollapse = true;
            $scope.parentCollapse = true;
            $scope.poiCollapse = true;
            $scope.touristicCollapse = [];

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
        }

        function initFiliation () {
            $scope.children = [];
            $scope.parents = [];
            $scope.previous = null;
            $scope.next = null;

            if (trek.properties.previous[$scope.parentId]) {
                $q.all({
                    previousData: treksFactory.getTrek(trek.properties.previous[$scope.parentId]),
                    parentData: treksFactory.getTrek($scope.parentId)
                    })
                    .then(
                        function (promisesData) {
                            var previousData = promisesData.previousData;
                            var parentData = promisesData.parentData;
                            if (previousData) {

                                if (parentData) {
                                    angular.forEach(parentData.properties.children, function (childId, stepNumber) {
                                        if (childId === previousData.id) {
                                            previousData.stepNumber = parseInt(stepNumber + 1);
                                        }
                                    });
                                }

                                $scope.previous = previousData;
                            }
                        }
                    );
            }
            if (trek.properties.next[$scope.parentId]) {
                $q.all({
                    nextData: treksFactory.getTrek(trek.properties.next[$scope.parentId]),
                    parentData: treksFactory.getTrek($scope.parentId)
                    })
                    .then(
                        function (promisesData) {
                            var nextData = promisesData.nextData;
                            var parentData = promisesData.parentData;
                            if (nextData) {

                                if (parentData) {
                                    angular.forEach(parentData.properties.children, function (childId, stepNumber) {
                                        if (childId === nextData.id) {
                                            nextData.stepNumber = parseInt(stepNumber + 1);
                                        }
                                    });
                                }

                                $scope.next = nextData;
                            }
                        }
                    );
            }
            if (trek.properties.parents && trek.properties.parents.length > 0) {
                angular.forEach(trek.properties.parents, function (parent) {
                    treksFactory.getTrek(parent)
                        .then(
                            function (parentData) {
                                if (parentData) {

                                    if ($scope.parentId && parentData.id === parseInt($scope.parentId)) {
                                        $scope.currentParent = parentData;
                                        angular.forEach(parentData.properties.children, function (childId, stepNumber) {
                                            if (childId === $scope.trek.id) {
                                                $scope.trek.stepNumber = parseInt(stepNumber + 1);
                                            }
                                        });
                                    }

                                    $scope.parents.push(parentData);
                                }
                            }
                        );
                });
            }
            if (trek.properties.children && trek.properties.children.length > 0) {
                angular.forEach(trek.properties.children, function (child, stepNumber) {
                    treksFactory.getTrek(child)
                        .then(
                            function (childData) {
                                if (childData) {
                                    childData.stepNumber = parseInt(stepNumber + 1);
                                    $scope.children.push(childData);
                                }
                            }
                        );
                });
            }
        }

        function initModal () {
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
        }

        function initView () {
            $scope.activateElevation = settings.ACTIVE_ELEVATION;
            $scope.showCollapseableCounter = settings.SHOW_COLLASPABLE_COUNTER;

            if ($stateParams.parentId) {
                $scope.parentId = $stateParams.parentId;
            }
            $scope.network_available = $rootScope.network_available;
            $scope.isAndroid = ionic.Platform.isAndroid();
            $scope.isSVG = utils.isSVG;
            $scope.trekId = $stateParams.trekId;
            $scope.trek = trek;
            $scope.pois = pois;
            $scope.touristics = touristics;

            // We need to declare our json HTML data as safe using $sce
            $scope.teaser = $sce.trustAsHtml(trek.properties.description_teaser);
            $scope.mainDescription = $sce.trustAsHtml(trek.properties.description);

            // get distance to treks and pois
            treksFactory.getTrekDistance($scope.trek)
            .then(function (userPosition) {
                poisFactory.getPoisDistance($scope.pois, userPosition);
            });

            initCollapser();
            initFiliation();
            initModal();
        }

        $scope.toggleCollapse = function (toggleName) {
            $scope[toggleName] = !$scope[toggleName];
            $timeout(function () {
                $ionicScrollDelegate.$getByHandle('modalScroll').resize();

                //Scroll to element
                if (!$scope[toggleName] && document.querySelector("#" + toggleName) !== null) {
                    $ionicScrollDelegate.$getByHandle('modalScroll').scrollTo(0, angular.element(document.querySelector("#" + toggleName))[0].offsetTop);
                }
            }, 500);
        };

        $scope.toggleTouristicCollapse = function (touristicId) {
            $scope.touristicCollapse[touristicId] = !$scope.touristicCollapse[touristicId];
            $timeout(function () {
                $ionicScrollDelegate.$getByHandle('modalScroll').resize();
               
                //Scroll to element
                if (!$scope[touristicId] && document.querySelector("#" + touristicId) !== null) {
                    $ionicScrollDelegate.$getByHandle('modalScroll').scrollTo(0, angular.element(document.querySelector("#" + touristicId))[0].offsetTop);
                }             
            }, 500);
        };

        $scope.back = function () {
            var backState = '';

            if ($rootScope.statename === 'home.map.detail') {
                backState = 'home.map';
            } else {
                backState = 'home.trek';
            }

            $state.go(backState);
        };

        $scope.goToTrekById = function (trekId, parentId) {
            $state.go($rootScope.statename, { trekId: trekId, parentId: parentId });
        };

        $scope.share = function () {
            console.log($scope.trek)
            socialSharingService.share(
                $scope.trek.properties.name+' : ',
                $scope.trek.properties.name, null,
                settings.PUBLIC_WEBSITE + '/' + accentsTidy($scope.trek.properties.practice.label) + '/' + $scope.trek.properties.slug
            );
        };

        function accentsTidy(s){
            var r = s.toLowerCase();
            var non_asciis = {'a': '[àáâãäå]', 'ae': 'æ', 'c': 'ç', 'e': '[èéêë]', 'i': '[ìíîï]', 'n': 'ñ', 'o': '[òóôõö]', 'oe': 'œ', 'u': '[ùúûűü]', 'y': '[ýÿ]'};
            for (var i in non_asciis) { r = r.replace(new RegExp(non_asciis[i], 'g'), i); }
            return r;
        };

        function downloadError(error, currentTrek) {
            console.error(error);
            currentTrek.tiles.inDownloadProgress = false;
        }

        function downloadSuccess(imgLoaded, tilesLoaded) {

            if (imgLoaded && tilesLoaded) {
                trek.tiles.inDownloadProgress = false;
                trek.tiles.isDownloaded = true;
                treksFactory.getTreks()
                    .then(
                        function (trekCollection) {
                            $rootScope.treks = trekCollection;
                        },
                        function (errorMsg) {
                            console.error(errorMsg);
                        }
                    );
            }else {
                var isWrong = '';
                if (!imgLoaded) {
                    isWrong = 'images';
                }
                if (!tilesLoaded) {
                    isWrong = 'tiles';
                }
                if (!tilesLoaded && !imgLoaded) {
                    isWrong = 'images and tiles';
                }

                trek.tiles.inDownloadProgress = false;
                console.error('issue with download of ' + isWrong);
            }

        }

        function downloadFiles() {
            var dlPercent = 0;
            var loadCounter = [0,0];
            var imgLoaded = false;
            var tilesLoaded = false;
            var hasDownloadedButNotUnzipped = [false, false];
            trek.tiles.realProgress = 0;
            trek.tiles.inDownloadProgress = true;

            var promises = [];

            promises.push(
                mapFactory.downloadTrekPreciseBackground($scope.trekId)
                    .then(
                        function (resultTiles){
                            imgLoaded = true;
                        }, function (error) {
                            trek.tiles.inDownloadProgress = false;
                        }, function (progress) {
                            trek.tiles.inDownloadProgress = true;
                            loadCounter[0] = Math.floor((progress.loaded / progress.total * 100) / 4);
                            trek.tiles.realProgress = dlPercent + loadCounter[0] + loadCounter[1];
                            if (loadCounter[0] >= 25 && dlPercent < 50 && !hasDownloadedButNotUnzipped[0]) {
                                hasDownloadedButNotUnzipped[0] = true;
                                dlPercent += 25;
                            }
                        }
                    )
            );

            promises.push(
                treksFactory.downloadTrekDetails($scope.trekId)
                    .then(
                        function (resultImgs) {
                            tilesLoaded = true;
                        }, function (error) {
                            trek.tiles.inDownloadProgress = false;
                        }, function (progress) {
                            trek.tiles.inDownloadProgress = true;
                            loadCounter[1] = Math.floor((progress.loaded / progress.total * 100) / 4);
                            trek.tiles.realProgress = dlPercent + loadCounter[0] + loadCounter[1];
                            if (loadCounter[1] >= 25 && dlPercent < 50 && !hasDownloadedButNotUnzipped[1]) {
                                hasDownloadedButNotUnzipped[1] = true;
                                dlPercent += 25;
                            }
                        }
                    )
            );


            return $q.all(promises)
                .then(
                    function () {
                        downloadSuccess(trek, imgLoaded, tilesLoaded);
                    },
                    function (error) {
                        downloadError(error, trek);
                    }
                );
        }

        $scope.downloadFiles = function () {
            $translate([
                'trek_controller_no_network_title',
                'trek_controller_no_network_label',
                'trek_controller_download_confirm_message',
                'trek_controller_donwload_warning_title',
                'trek_controller_donwload_warning_message',
                'trek_controller_download_confirm_title',
                'trek_controller_donwload_cancel'
            ]).then(function (translations) {
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

                    trek.tiles.inDownloadProgress = false;

                    return confirmPopup.then(function (confirmed) {
                        if (confirmed) {
                            downloadFiles();
                        }
                    });
                }
            });
        };

        initView();

    }
]);
