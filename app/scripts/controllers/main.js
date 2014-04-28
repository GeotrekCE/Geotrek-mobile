'use strict';


angular.module('geotrekMobileControllers', ['leaflet-directive'])
.controller('TrekListController', function ($scope, TreksData) {
    $scope.description = 'Trek List !';

    $scope.treks = TreksData.query();
})
.controller('TrekController', function ($scope, $routeParams, TreksData) {
    $scope.description = 'Trek detail !';
    console.log($routeParams);

    $scope.treks = TreksData.query();

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