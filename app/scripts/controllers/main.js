'use strict';


angular.module('geotrekMobileControllers', ['leaflet-directive'])
.controller('TrekListController', function ($scope, TreksData) {
    $scope.description = 'Trek List !';

    TreksData.query().success(function(data) {
       $scope.treks = data.features.splice(0, 10); 
    });
  })
.controller('TrekController', function ($scope, $routeParams, TreksData) {
    $scope.description = 'Trek detail !';
    TreksData.text()
    console.log($routeParams);
})
.controller('MapController', function ($scope) {
    $scope.description = 'Global Map !';

    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        }
    });
});