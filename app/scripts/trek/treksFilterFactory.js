'use strict';

var geotrekTreks = angular.module('geotrekTreks');

/**
 * Service that gives treks filters
 */

geotrekTreks.service('dynamicTreksFiltersService', ['$q', function($q) {

    // Getting treks to create appropriate filters

    this.getTrekFilters = function(treks) {

        var trekThemes = [],
            trekUses = [],
            trekRoute = [],
            trekValleys = [],
            trekMunicipalities = [];

        angular.forEach(treks.features, function(trek) {
            // Themes init
            angular.forEach(trek.properties.themes, function(theme) {
                trekThemes.push({value: theme.id, name: theme.label});
            });
            // Uses init
            angular.forEach(trek.properties.usages, function(usage) {
                trekUses.push({value: usage.id, name: usage.label});
            });
            // Route init
            var route = trek.properties.route;
            trekRoute.push({value: route.id, name: route.label});
            // Valleys init
            angular.forEach(trek.properties.districts, function(district) {
                trekValleys.push({value: district.id, name: district.label});
            });
            // Municipalities init
            angular.forEach(trek.properties.cities, function(city) {
                trekMunicipalities.push({value: city.code, name: city.name});
            });
        });

        return {
            difficulties : [
                { value: 1, name: 'Facile', icon: 'difficulty-1.svg' },
                { value: 2, name: 'Moyen', icon: 'difficulty-2.svg' },
                { value: 3, name: 'Difficile', icon: 'difficulty-2.svg' },
                { value: 4, name: 'Difficile', icon: 'difficulty-2.svg' }
            ],
            durations : [
                { value: 2.5, name: '<2H30', icon: 'duration-1.svg' },
                { value: 4, name: '1/2', icon: 'duration-2.svg' },
                { value: 8, name: 'Journée', icon: 'duration-3.svg' }
            ],
            elevations : [
                { value: 300, name: '300m', icon: 'deniv1.svg' },
                { value: 600, name: '600m', icon: 'deniv1.svg' },
                { value: 1000, name: '1000m', icon: 'deniv1.svg' }
            ],
            themes : trekThemes,
            uses: trekUses,
            route: trekRoute,
            valleys: trekValleys,
            municipalities: trekMunicipalities
        }
    };
}]);
