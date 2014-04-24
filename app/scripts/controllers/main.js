'use strict';

angular.module('geotrekMobileControllers', [])
  .controller('TrekListController', function ($scope, $http) {
    $scope.description = 'Trek List !';

    $http.get('trek.geojson').success(function(data) {
      $scope.treks = data.features.splice(0, 10);
    });
  })
  .controller('MapController', function ($scope) {
    $scope.description = 'Global Map !';
  });