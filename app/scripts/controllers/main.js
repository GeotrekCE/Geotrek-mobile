'use strict';


angular.module('geotrekMobileControllers', ['leaflet-directive'])
.controller('TrekListController', function ($scope, $http) {
    $scope.description = 'Trek List !';

    $http.get('trek.geojson').success(function(data) {
      $scope.treks = data.features.splice(0, 10);
    });
  })
.controller('TrekController', function ($scope, $routeParams) {
    $scope.description = 'Trek detail !';
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
