'use strict';

describe('geotrekMobileApp controllers', function() {
    // 'test values would not match the responses exactly' we use this to solve the problem
    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    // load modules
    beforeEach(module('geotrekMobileControllers'));
    beforeEach(module('geotrekMobileServices'));
    
    describe('TrekListController', function () {
        var trekListController,
            scope,
            $httpBackend;

        // Initialize the controller, a mock scope and $http service
        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('trek.geojson?method=GET&url=trek.geojson').
                respond({
                    "crs": {},
                    "features": [{
                        geometry: {},
                        id: 903944,
                        properties: {},
                        type: "Feature"  
                    }]
                });

            scope = $rootScope.$new();
            trekListController = $controller('TrekListController', {$scope: scope});
        }));

        it('should create "treks" model fetched from xhr', function() {
            expect(scope.treks).toBeUndefined();
            $httpBackend.flush();
     
            expect(scope.treks).toEqualData([{
                geometry: {},
                id: 903944,
                properties: {},
                type: "Feature"   
            }]);
        });
    });
});
