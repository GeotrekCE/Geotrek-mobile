'use strict';


angular.module('geotrekMobileControllers', ['leaflet-directive'])
.controller('TrekController', function ($scope, $state, TreksFilters, TreksData) {

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
    }

    // Filter treks everytime our filters change
    $scope.filterTreks = function (trek) {
        if (filterTrekWithFilter(trek.properties.difficulty.id, 'difficulty') &&
            filterTrekWithFilter(trek.properties.duration, 'duration') &&
            filterTrekWithFilter(trek.properties.ascent, 'elevation')) {
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
    }

    function filterTrekWithFilter(trekValue, property) {
        // Trek considered as matching if filter not set or if
        // property is empty.
        if (trekValue === undefined ||
            angular.isUndefined($scope.activeFilters[property]) ||
            $scope.activeFilters[property] === null) {
            return true;
        }

        if (trekValue <= $scope.activeFilters[property]) {
            return true;
        } else {
            return false;
        }
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
})
.controller('TrekListController', function ($scope, TreksData) {
    // Default ordering is already alphabetical, so we comment this line
    // $scope.orderProp = 'properties.name';
})
.controller('TrekDetailController', function ($scope, $ionicModal, $stateParams, TreksData, $sce) {
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
