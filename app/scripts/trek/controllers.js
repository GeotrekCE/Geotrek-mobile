'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.controller('TrekController', function ($rootScope, $scope, $state, $window, $ionicActionSheet, $ionicModal, treksFilters, treks, staticPages, globalizationService, localeSettings, utils) {

    $rootScope.statename = $state.current.name;

    // treks and staticPages come from TrekController routing resolve
    $rootScope.treks = treks;
    $rootScope.staticPages = staticPages;

    // Define filters from service to the scope for the view
    $scope.filtersData = {
        difficulties : treksFilters.difficulties,
        durations    : treksFilters.durations,
        elevations   : treksFilters.elevations,
        themes       : treksFilters.themes,
        communes     : treksFilters.communes
    };

    // Prepare an empty object to store currently selected filters
    $scope.activeFilters = {
        difficulty: undefined,
        duration:   undefined,
        elevation:  undefined,
        theme:      undefined,
        commune:    null,
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
            filterTrekWithThemes(trek.properties.themes, $scope.activeFilters.theme) &&
            filterTrekWithCities(trek.properties.cities, $scope.activeFilters.commune));
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

    // Triggered on a button click, or some other target
    $scope.chooseLanguage = function () {
        // Show the action sheet
        var languages = localeSettings;

        $ionicActionSheet.show({
            buttons: languages,
            cancel: function() {

            },
            buttonClicked: function(index) {
                var chosenLocale = languages[index].locale;
                globalizationService.setLanguage(chosenLocale);
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

    function filterTrekWithThemes(themesValues, value) {
        var isMatching = false;
        // Trek considered as matching if filter not set or if
        // property is empty.
        if (!(isValidFilter(themesValues, value))) {
            return true;
        }

        angular.forEach(themesValues, function(themeValue) {
            if (themeValue.id === undefined) {
                isMatching = true;
            }

            if (themeValue.id === value) {
                isMatching = true;
            }
        });

        return isMatching;
    }

    function filterTrekWithCities(citiesValues, value) {
        var isMatching = false;
        // Trek considered as matching if filter not set or if
        // property is empty.
        if (!(isValidFilter(citiesValues, value))) {
            return true;
        }

        angular.forEach(citiesValues, function(cityValue) {
            if (cityValue.code === undefined) {
                isMatching = true;
            }

            if (cityValue.code === value.value) {
                isMatching = true;
            }
        });

        return isMatching;
    }

    // Watch for changes on filters, then reload the treks to keep them synced
    $scope.$watchCollection('activeFilters', function() {
        $scope.$broadcast('OnFilter');
    });
})
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
