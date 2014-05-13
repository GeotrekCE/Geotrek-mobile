'use strict';


angular.module('geotrekMobileControllers', ['leaflet-directive'])

.controller('TrekController', function ($scope, TreksFilters) {

    // Filters
    $scope.difficulties = TreksFilters.difficulties;
    $scope.durations    = TreksFilters.durations;
    $scope.elevations   = TreksFilters.elevations;

    $scope.activeFilters = {
        difficulty: undefined,
        duration:   undefined,
        elevation:  undefined
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
})
.controller('TrekListController', function ($scope, TreksData) {
    $scope.description = 'Trek List !';

    TreksData.getTreks().then(function(treks) {
        $scope.treks = treks;
    });

    // Default ordering is already alphabetical, so we comment this line
    // $scope.orderProp = 'properties.name';

})
.controller('TrekDetailController', function ($scope, $ionicModal, $stateParams, TreksData, $sce) {
    $scope.description = 'Trek detail !';
    console.log($stateParams);

    TreksData.getTrek($stateParams.trekId).then(function(trek) {
        $scope.trek = trek;
        $scope.teaser = $sce.trustAsHtml(trek.properties.description_teaser);
    });

    $scope.trekId = $stateParams.trekId;

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
})
.controller('MapController', function ($scope) {
    $scope.description = 'Global Map !';

    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        }
    });
});