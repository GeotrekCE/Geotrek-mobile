'use strict';

angular.module('geotrekMobileControllers', [])
  .controller('TrekListController', function ($scope) {
    $scope.description = 'Trek List !';
  })
  .controller('MapController', function ($scope) {
    $scope.description = 'Global Map !';
  });