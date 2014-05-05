'use strict';


angular.module('geotrekMobileControllers', ['leaflet-directive'])
.controller('TrekListController', function ($scope, TreksData) {
    $scope.description = 'Trek List !';

    TreksData.getTreks().then(function(treks) {
        $scope.treks = treks;
    });

    // Default ordering is already alphabetical, so we comment this line
    // $scope.orderProp = 'properties.name';


    // Filters
    $scope.difficulties = [
        { value: '1', name: 'Facile' },
        { value: '2', name: 'Moyen' },
        { value: '3', name: 'Difficile' }
    ];

    $scope.durations = [
        { value: '4', name: '2H30' },
        { value: '10', name: '1/2' },
        { value: '10.1', name: 'Journée' }
    ];

    $scope.elevations = [
        { value: '300', name: '300m' },
        { value: '600', name: '600m' },
        { value: '1000', name: '1000m' }
    ];

    $scope.activeFilters = {
        difficulty: undefined,
        duration: undefined,
        elevation: undefined
    }

    $scope.filterTreks = function (trek) {
        console.log(trek);
        if (filterTrekWithFilter(trek.properties.difficulty.id, $scope.difficulties, 'difficulty') &&
            filterTrekWithFilter(trek.properties.duration, $scope.durations, 'duration') &&
            filterTrekWithFilter(trek.properties.elevation, $scope.elevations, 'elevation'))
             return true;
        return false;
    };

    function filterTrekWithFilter(trekValue, category, property) {
        var value = trekValue;
        // console.log(trekValue);
        // Trek considered as matching if filter not set or if
        // property is empty.
        if (value === undefined ||
            angular.isUndefined($scope.activeFilters[property]) ||
            $scope.activeFilters[property] === null) {
            return true;
        }

        var rangeValues = self._values[category],
            rangeMin = 0,
            rangeMax = rangeValues.length-1,
            min = self.state.sliders[category].min,
            max = self.state.sliders[category].max;

        if (max === rangeMin) {
            // Both on minimum value
            return value <= rangeValues[rangeMin];
        }
        if (min === rangeMax) {
            // Both on maximum values
            return value >= rangeValues[rangeMax];
        }

        var minVal = rangeValues[min - 1],
            maxVal = rangeValues[max + 1];

        if (category == 'altitude' && min != max) {
            minVal = rangeValues[min];
            maxVal = rangeValues[max];
        }

        if (min === rangeMin) {
            // Filter by max only
            return value < maxVal;
        }
        if (max === rangeMax) {
            // Filter by min only
            return value > minVal;
        }
        return value > minVal && value < maxVal;
    }

    $scope.durationFilter = function (trek) {
        if (angular.isUndefined($scope.activeFilters.duration) || $scope.activeFilters.duration === null) {
            return true;
        };

        if (trek.properties.duration <= $scope.activeFilters.duration) {
            return true;
        } else {
            return false;
        }
    }
})
.controller('TrekController', function ($scope, $routeParams, TreksData, $sce) {
    $scope.description = 'Trek detail !';
    console.log($routeParams);

    TreksData.getTrek($routeParams.trekId).then(function(trek) {
        $scope.trek = trek;
        $scope.teaser = $sce.trustAsHtml(trek.properties.description_teaser);
    });

    $scope.trekId = $routeParams.trekId;
})
.controller('MapController', function ($scope) {
    $scope.description = 'Global Map !';

    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        }
    });
});