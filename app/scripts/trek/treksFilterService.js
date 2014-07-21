'use strict';

var geotrekTreks = angular.module('geotrekTreks');

/**
 * Service that gives trek filters
 */

geotrekTreks.service('treksFiltersService', ['$q', function($q) {

    // Get default value for each filter field
    this.getDefaultActiveFilterValues = function() {
        return {
            difficulty:   undefined,
            duration:     undefined,
            elevation:    undefined,
            theme:        undefined,
            municipality: null,
            use:          null,
            valley:       null,
            route:        null,
            search:       ''
        }
    };

    this.isValidFilter = function(value, filter) {
        var valid = true;
        if (angular.isUndefined(value)
            || angular.isUndefined(filter)
            || (filter === null)
            || (value === null))
            {
                valid = false;
            }
        return valid;
    };

    // Generic function that is called on hardcoded filters
    this.filterTrekWithFilter = function(trekValue, filter) {

        // Trek considered as matching if filter not set or if
        // property is empty.
        if (!(this.isValidFilter(trekValue, filter))) {
            return true;
        }

        return (trekValue <= filter);
    };

    // Generic function that is called on select filters
    this.filterTrekWithSelect = function(selectOptionValues, formValue, fieldToCheck) {
        // Trek considered as matching if filter not set or if
        // property is empty.
        if (!(this.isValidFilter(selectOptionValues, formValue))) {
            return true;
        }

        if (!angular.isArray(selectOptionValues)) {
            selectOptionValues = [selectOptionValues];
        }

        // Using native loops instead of angularjs forEach because we want to stop searching
        // when value has been found
        for (var i=0; i<selectOptionValues.length; i++) {
            var fieldValue = selectOptionValues[i][fieldToCheck];
            if (angular.isUndefined(fieldValue) || (fieldValue === formValue.value)) {
                return true;
            }
        };

        return false;
    };

    // Function called each time a filter is modified, to know which treks to displayed
    this.filterTreks = function(trek, activeFilters) {

        return (this.filterTrekWithFilter(trek.properties.difficulty.id, activeFilters.difficulty) &&
            this.filterTrekWithFilter(trek.properties.duration, activeFilters.duration) &&
            this.filterTrekWithFilter(trek.properties.ascent, activeFilters.elevation) &&
            this.filterTrekWithSelect(trek.properties.themes, activeFilters.theme, 'id') &&
            this.filterTrekWithSelect(trek.properties.usages, activeFilters.use, 'id') &&
            this.filterTrekWithSelect(trek.properties.route, activeFilters.route, 'id') &&
            this.filterTrekWithSelect(trek.properties.valleys, activeFilters.valley, 'id') &&
            this.filterTrekWithSelect(trek.properties.cities, activeFilters.municipality, 'code'));
    };


    // Remove filter duplicates that have the same "value"
    this.removeFilterDuplicates = function(array) {

        var dict = {}, result=[];
        for (var i=0; i<array.length; i++) {
            var currentValue = array[i].value;
            dict[currentValue] = array[i];
        }
        var dictKeys = Object.keys(dict);
        for (var i=0; i<dictKeys.length; i++) {
            result.push(dict[dictKeys[i]]);
        }

        return result;
    };

    // Sort filter values by their name
    this.sortFilterNames = function(array) {
        array.sort(function(a, b) {
            var nameA = a.name;
            var nameB = b.name;
            return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
        });

        return array;
    };

    // Possible values that user can select on filter sidebar menu.
    // Some are hardcoded (difficulties, durations, elevations),
    // others come from trek possible values
    this.getTrekFilterOptions = function(treks) {

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

        // Removing possible values duplicates
        trekThemes = this.removeFilterDuplicates(trekThemes);
        trekUses = this.removeFilterDuplicates(trekUses);
        trekRoute = this.removeFilterDuplicates(trekRoute);
        trekValleys = this.removeFilterDuplicates(trekValleys);
        trekMunicipalities = this.removeFilterDuplicates(trekMunicipalities);

        // Sort values by their name
        trekThemes = this.sortFilterNames(trekThemes);
        trekUses = this.sortFilterNames(trekUses);
        trekRoute = this.sortFilterNames(trekRoute);
        trekValleys = this.sortFilterNames(trekValleys);
        trekMunicipalities = this.sortFilterNames(trekMunicipalities);

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
            routes: trekRoute,
            valleys: trekValleys,
            municipalities: trekMunicipalities
        }
    };
}]);
