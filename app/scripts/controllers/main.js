'use strict';


angular.module('geotrekMobileControllers', ['leaflet-directive'])
.controller('TrekListController', function ($scope, TreksData) {
    $scope.description = 'Trek List !';

    TreksData.getTreksData().then(function(treks) {
        $scope.treks = treks;
    });

    // Default ordering is already alphabetical, so we comment this line
    // $scope.orderProp = 'properties.name';
})
.controller('TrekController', function ($scope, $routeParams, TreksData) {
    $scope.description = 'Trek detail !';
    console.log($routeParams);

    TreksData.getTreksData().then(function(treks) {
        $scope.treks = treks;
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