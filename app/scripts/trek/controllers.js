'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.controller('TrekController',
    ['$rootScope', '$scope', '$state', '$window', '$ionicActionSheet', '$ionicModal', 'treks', 'staticPages', 'localeSettings', 'utils', 'dynamicTreksFiltersService',
     function ($rootScope, $scope, $state, $window, $ionicActionSheet, $ionicModal, treks, staticPages, localeSettings, utils, dynamicTreksFiltersService) {

    $rootScope.statename = $state.current.name;

    // treks and staticPages come from TrekController routing resolve
    $rootScope.treks = treks;
    $rootScope.staticPages = staticPages;

    var dynamicTreksFilters = dynamicTreksFiltersService.getTrekFilters(treks);

    // Define filters from service to the scope for the view
    $scope.filtersData = {
        difficulties : dynamicTreksFilters.difficulties,
        durations    : dynamicTreksFilters.durations,
        elevations   : dynamicTreksFilters.elevations,
        themes       : dynamicTreksFilters.themes,
        communes     : dynamicTreksFilters.municipalities,
        uses         : dynamicTreksFilters.uses,
        valleys      : dynamicTreksFilters.valleys,
        routes       : dynamicTreksFilters.route,
    };

    // Prepare an empty object to store currently selected filters
    $scope.activeFilters = {
        difficulty: undefined,
        duration:   undefined,
        elevation:  undefined,
        theme:      undefined,
        commune:    null,
        use:        null,
        valley:     null,
        route:      null,
        search:     ''
    };

    // Give access to state data to our View for active state
    $scope.$state = $state;

    // Show search input or not
    $scope.showSearch = {
        search : 0 // Hidden by default
    };

    // Filter treks everytime our filters change
    $scope.filterTreks = function (trek) {

        return (filterTrekWithFilter(trek.properties.difficulty.id, $scope.activeFilters.difficulty) &&
            filterTrekWithFilter(trek.properties.duration, $scope.activeFilters.duration) &&
            filterTrekWithFilter(trek.properties.ascent, $scope.activeFilters.elevation) &&
            filterTrekWithSelect(trek.properties.themes, $scope.activeFilters.theme, 'id') &&
            filterTrekWithSelect(trek.properties.usages, $scope.activeFilters.use, 'id') &&
            filterTrekWithSelect(trek.properties.route, $scope.activeFilters.route, 'id') &&
            filterTrekWithSelect(trek.properties.valleys, $scope.activeFilters.valley, 'id') &&
            filterTrekWithSelect(trek.properties.cities, $scope.activeFilters.commune, 'code'));
    };

    $scope.resetFilters = function () {
        $scope.activeFilters = {
            difficulty: undefined,
            duration:   undefined,
            elevation:  undefined,
            theme:      undefined,
            commune:    null,
            search:     ''
        };
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

    function isValidFilter(value, filter) {
        var valid = true;
        if (angular.isUndefined(value)
            || angular.isUndefined(filter)
            || (filter === null)
            || (value === null))
            {
                valid = false;
            }
        return valid;
    };

    function filterTrekWithFilter(trekValue, filter) {

        // Trek considered as matching if filter not set or if
        // property is empty.
        if (!(isValidFilter(trekValue, filter))) {
            return true;
        }

        return (trekValue <= filter);
    }

    function filterTrekWithSelect(selectOptionValues, formValue, fieldToCheck) {
        // Trek considered as matching if filter not set or if
        // property is empty.
        if (!(isValidFilter(selectOptionValues, formValue))) {
            return true;
        }

        if (!angular.isArray(selectOptionValues)) {
            selectOptionValues = [selectOptionValues];
        }

        // Using native loops instead of angularjs forEach because we want to stop searching
        // when value has been found
        for (var i=0; i<selectOptionValues.length; i++) {
            var fieldValue = selectOptionValues[i][fieldToCheck];
            if (angular.isUndefined(fieldValue) || (fieldValue === formValue.value)) {
                return true;
            }
        };

        return false;
    }

    // Watch for changes on filters, then reload the treks to keep them synced
    $scope.$watchCollection('activeFilters', function() {
        $scope.$broadcast('OnFilter');
    });
}])
.controller('TrekListController', ['$rootScope', '$state', '$scope', function ($rootScope, $state, $scope) {

    $rootScope.statename = $state.current.name;
    // Ordering by distance
    // If distance is not available, default ordering is trek.geojson one
    $scope.orderProp = 'distanceFromUser';
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
