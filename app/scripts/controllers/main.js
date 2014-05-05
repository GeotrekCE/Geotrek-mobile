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
    $scope.difficulty = [
        { value: '1', name: 'Facile' },
        { value: '2', name: 'Moyen' },
        { value: '3', name: 'Difficile' }
    ];

    $scope.durations = [
        { value: '4', name: '2H30' },
        { value: '10', name: '1/2' },
        { value: '10.1', name: 'Journée' }
    ];

    $scope.elevation = [
        { value: '300', name: '300m' },
        { value: '600', name: '600m' },
        { value: '1000', name: '1000m' }
    ];

    $scope.durationFilter = function (trek) {
        if (angular.isUndefined($scope.duration) || $scope.duration === null) {
            return true;
        };

        if (trek.properties.duration <= $scope.duration) {
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