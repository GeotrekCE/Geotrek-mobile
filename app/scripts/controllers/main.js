'use strict';


angular.module('geotrekMobileControllers', ['leaflet-directive'])
.controller('TrekController', function ($scope, $state, $window, $ionicActionSheet, $ionicModal, TreksFilters, TreksData, StaticPages) {

    // Define utils variables for specific device behaviours
    $scope.isAndroid = $window.ionic.Platform.isAndroid() || $window.ionic.Platform.platforms[0] == "browser";
    $scope.isIOS = $window.ionic.Platform.isIOS();

    // Define filters from service to the scope for the view
    $scope.filtersData = {
        difficulties : TreksFilters.difficulties,
        durations    : TreksFilters.durations,
        elevations   : TreksFilters.elevations,
        themes       : TreksFilters.themes,
        communes     : TreksFilters.communes
    };

    // Prepare an empty object to store currently selected filters
    $scope.activeFilters = {
        difficulty: undefined,
        duration:   undefined,
        elevation:  undefined,
        theme: undefined,
        commune: null,
        search: ''
    };

    // Give access to state data to our View for active state
    $scope.$state = $state;

    // Show search input or not
    $scope.showSearch = {
        search : 0 // Hidden by default
    };

    // Filter treks everytime our filters change
    $scope.filterTreks = function (trek) {
        if (filterTrekWithFilter(trek.properties.difficulty.id, $scope.activeFilters.difficulty) &&
            filterTrekWithFilter(trek.properties.duration, $scope.activeFilters.duration) &&
            filterTrekWithFilter(trek.properties.ascent, $scope.activeFilters.elevation)) {
            return true;
        }
        return false;
    };

    $scope.resetFilters = function () {
        $scope.activeFilters = {
            difficulty: undefined,
            duration:   undefined,
            elevation:  undefined,
            theme: undefined,
            commune: null,
            search: ''
        };
    };

    // Triggered on a button click, or some other target
    $scope.showMore = function () {
        // Show the action sheet
        $ionicActionSheet.show({
            buttons: $scope.staticPages,
            cancel: function() {

            },
            buttonClicked: function(index) {
                createModal($scope.staticPages[index].text);

                return true;
            }
        });
    };

    function filterTrekWithFilter(trekValue, filter) {
        // Trek considered as matching if filter not set or if
        // property is empty.
        if (trekValue === undefined ||
            angular.isUndefined(filter) ||
            filter === null) {
            return true;
        }

        if (trekValue <= filter) {
            return true;
        } else {
            return false;
        }
    }

    function createModal(template) {
        // Display the modal (this is the entire view here)
        var modal = $ionicModal.fromTemplate(template, {
            scope: $scope,
            animation: 'slide-in-up'
        });
        modal.show();
        
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
    }

    // Watch for changes on filters, then reload the treks to keep them synced
    $scope.$watchCollection('activeFilters', function() {
        $scope.$broadcast('OnFilter');
    });

    // Load treks and tell the child scopes when it's ready
    TreksData.getTreks().then(function(treks) {
        $scope.treks = treks;
        $scope.$broadcast('OnTreksLoaded');
    });

    // Load static pages
    StaticPages.getStaticPages().then(function(pages) {
        $scope.staticPages = pages;
    });
})
.controller('TrekListController', function ($scope, TreksData) {
    // Default ordering is already alphabetical, so we comment this line
    // $scope.orderProp = 'properties.name';
})
.controller('TrekDetailController', function ($scope, $ionicModal, $stateParams, $sce, TreksData, SocialSharing) {
    console.log($stateParams);

    $scope.trekId = $stateParams.trekId;
    
    // Get current trek data from the treks file
    TreksData.getTrek($stateParams.trekId).then(function(trek) {
        $scope.trek = trek;

        // We need to declare our json HTML data as safe using $sce
        $scope.teaser = $sce.trustAsHtml(trek.properties.description_teaser);
    });

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

    $scope.share = function(message) {
        SocialSharing.share(message);
    }
})
.controller('MapController', function ($scope, leafletData, filterFilter) {
    // Set default Leaflet map params
    angular.extend($scope, {
        center: {
            lat: 44.8,
            lng: 6.2,
            zoom: 9
        },
        defaults: {
            scrollWheelZoom: false,
            zoomControl: false // Not needed on Android/iOS modern devices
        }
    });

    if (angular.isDefined($scope.treks)) { // If treks data are already loaded
        showTreks();
    } else { // Data not yet loaded, wait for loading, then display treks on map
        $scope.$on('OnTreksLoaded', showTreks);
    }

    $scope.$on('OnFilter', function() {
        if (angular.isDefined($scope.treks)) {
            showTreks();
        }
    });

    // Add treks geojson to the map
    function showTreks() {
        angular.extend($scope, {
            geojson: {
                data: filterFilter($scope.treks.features, $scope.activeFilters.search),
                filter: $scope.filterTreks,
                style: {
                    fillColor: "green",
                    weight: 2,
                    opacity: 1,
                    color: 'black',
                    dashArray: '3',
                    fillOpacity: 0.7
                }
            }
        }); 
    }
})
.controller('MapControllerDetail', function ($scope, $stateParams) {
    console.log($stateParams);
});
