'use strict';


angular.module('geotrekMobileControllers', ['leaflet-directive'])
.controller('TrekListController', function ($scope, TreksData, TreksFilters) {
    $scope.description = 'Trek List !';

    TreksData.getTreks().then(function(treks) {
        $scope.treks = treks;
    });

    // Default ordering is already alphabetical, so we comment this line
    // $scope.orderProp = 'properties.name';


    // Filters
    $scope.difficulties = TreksFilters.difficulties;
    $scope.durations    = TreksFilters.durations;
    $scope.elevations   = TreksFilters.elevations;

    $scope.activeFilters = {
        difficulty: undefined,
        duration: undefined,
        elevation: undefined
    };

    $scope.filterTreks = function (trek) {
        if (filterTrekWithFilter(trek.properties.difficulty.id, $scope.difficulties, 'difficulty') &&
            filterTrekWithFilter(trek.properties.duration, $scope.durations, 'duration') &&
            filterTrekWithFilter(trek.properties.ascent, $scope.elevations, 'elevation')) {
            return true;
        }
        return false;
    };

    function filterTrekWithFilter(trekValue, category, property) {
        // console.log(trekValue);
        // console.log($scope.activeFilters[property]);
        
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

    $scope.durationFilter = function (trek) {
        if (angular.isUndefined($scope.activeFilters.duration) || $scope.activeFilters.duration === null) {
            return true;
        }

        if (trek.properties.duration <= $scope.activeFilters.duration) {
            return true;
        } else {
            return false;
        }
    };
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