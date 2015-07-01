'use strict';

var geotrekTreks = angular.module('geotrekTreks');

/**
 * Service that gives trek filters
 */

geotrekTreks.service('treksFiltersService', ['$q', '$sce', 'settings', function($q, $sce, settings) {

    // Get default value for each filter field
    this.getDefaultActiveFilterValues = function() {
        return {
            difficulty:   {},
            duration:     {},
            elevation:    {},
            download:     undefined,
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
            || (value === null)
            || (angular.equals(filter, {})))
            {
                valid = false;
            }
        return valid;
    };

    // Generic function that is called on hardcoded filters
    this.filterTrekWithFilter = function(trekValue, filter) {

        // Trek considered as matching if filter not set or if
        // property is empty.
        var is_valid = true;

        if (this.isValidFilter(trekValue, filter)) {
            if(angular.isNumber(filter)){
                is_valid = trekValue <= filter;
            }
            else{
                var keys = Object.keys(filter);
                for (var i = 0; i < keys.length; i++) {
                    if (filter[keys[i]] === true ){
                        // In combined filters if one filter is valid, no need to look on the other
                        // OR operator
                        if (trekValue <= parseFloat(keys[i])){
                            return true;
                        }
                        else{
                            is_valid = false;
                        }
                    }
                };
            }
        }
        return is_valid;
    };

    // Generic function that is called on hardcoded range filters
    this.filterTrekWithInterval = function(trekValue, filters) {
        var is_valid = true;
        var keys = Object.keys(filters);
        for (var i = 0; i < keys.length; i++) {
            var filter = filters[keys[i]];
            if (filter.checked === true ){
                // In combined filters if one filter is valid, no need to look on the other
                // OR operator
                if (parseFloat(trekValue) >= parseFloat(filter.interval[0]) && parseFloat(trekValue) <= parseFloat(filter.interval[1])){
                    return true;
                }
                else{
                    is_valid = false;
                }
            }
        };
        return is_valid;
    };

    // Generic function that is called on hardcoded filters
    this.filterTrekEquals = function(trekValue, filter) {

        var is_valid = true;
        if (this.isValidFilter(trekValue, filter)) {
            if(angular.isNumber(filter)){
                is_valid = trekValue === filter;
            }
            else{
                var keys = Object.keys(filter);
                for (var i = 0; i < keys.length; i++) {
                    if (filter[keys[i]] === true ){
                        // In combined filters if one filter is valid, no need to look on the other
                        // OR operator
                        if (parseFloat(trekValue) === parseFloat(keys[i])){
                            return true;
                        }
                        else{
                            is_valid = false;
                        }
                    }
                };
            }
        }
        return is_valid;
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

    this.filterIsActive = function (filter) {
        if (!filter) {
            return false;
        }

        if (typeof filter === 'object') {
            var result = false;
            angular.forEach(filter, function (value) {
                if (value.checked || value === true) {
                    result = true;
                }
            });
            return result;
        }

        return true;
    };

    // Function called each time a filter is modified, to know which treks to display
    this.filterTreks = function(treks, activeFilters) {
        var self = this;
        var filteredTreks = [];
        angular.forEach(treks, function(trek) {
            if (
                (!self.filterIsActive(activeFilters.difficulty) || (trek.properties.difficulty && self.filterTrekEquals(trek.properties.difficulty.id, activeFilters.difficulty))) &&
                (!self.filterIsActive(activeFilters.duration) || (trek.properties.duration && self.filterTrekWithInterval(trek.properties.duration, activeFilters.duration))) &&
                (!self.filterIsActive(activeFilters.elevation) || (trek.properties.ascent && self.filterTrekWithInterval(trek.properties.ascent, activeFilters.elevation))) &&
                (!self.filterIsActive(activeFilters.eLength) || (trek.properties.eLength && self.filterTrekWithInterval(trek.properties.eLength, activeFilters.eLength))) &&
                (!self.filterIsActive(activeFilters.download) || (trek.tiles && self.filterTrekEquals((trek.tiles && trek.tiles.isDownloaded) ? 1 : 0, activeFilters.download))) &&
                (!self.filterIsActive(activeFilters.theme) || (trek.properties.properties && self.filterTrekWithSelect(trek.properties.themes, activeFilters.theme, 'id'))) &&
                (!self.filterIsActive(activeFilters.use) || (trek.properties.usages && self.filterTrekWithSelect(trek.properties.usages, activeFilters.use, 'id'))) &&
                (!self.filterIsActive(activeFilters.route) || (trek.properties.route && self.filterTrekWithSelect(trek.properties.route, activeFilters.route, 'id'))) &&
                (!self.filterIsActive(activeFilters.valley) || (trek.properties.districts && self.filterTrekWithSelect(trek.properties.districts, activeFilters.valley, 'id'))) &&
                (!self.filterIsActive(activeFilters.municipality) || (trek.properties.cities && self.filterTrekWithSelect(trek.properties.cities, activeFilters.municipality, 'code')))
            ) {
                filteredTreks.push(trek);
            }
        });
        return filteredTreks;
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

    // Sort filter values by their value
    this.sortFilterValues = function(array) {
        array.sort(function(a, b) {
            var valueA = a.value;
            var valueB = b.value;
            return (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0;
        });

        return array;
    };

    // Possible values that user can select on filter sidebar menu.
    // Some are constants defined in settings (durations, elevations),
    // others come from trek possible values
    this.getTrekFilterOptions = function(treks) {

        var trekThemes = [],
            trekUses = [],
            trekRoute = [],
            trekValleys = [],
            trekMunicipalities = [],
            trekDifficulties = [];

        angular.forEach(treks.features, function(trek) {

            // Themes init
            angular.forEach(trek.properties.themes, function(theme) {
                trekThemes.push({value: theme.id, name: theme.label});
            });

            // Diffulties init

            var difficulty = trek.properties.difficulty;
            if (difficulty) {
                trekDifficulties.push({value: difficulty.id, name: difficulty.label, icon: $sce.trustAsResourceUrl(difficulty.pictogram)});
            }

            // Uses init
            angular.forEach(trek.properties.usages, function(usage) {
                trekUses.push({value: usage.id, name: usage.label});
            });

            // Route init
            var route = trek.properties.route;
            if (route) {
                trekRoute.push({value: route.id, name: route.label});
            }

            // Valleys init
            angular.forEach(trek.properties.districts, function(district) {
                trekValleys.push({value: district.id, name: district.name});
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
        trekDifficulties =  this.removeFilterDuplicates(trekDifficulties);

        // Sort values by their name
        trekThemes = this.sortFilterNames(trekThemes);
        trekUses = this.sortFilterNames(trekUses);
        trekRoute = this.sortFilterNames(trekRoute);
        trekValleys = this.sortFilterNames(trekValleys);
        trekMunicipalities = this.sortFilterNames(trekMunicipalities);
        trekDifficulties = this.sortFilterValues(trekDifficulties);

        return {
            difficulties : trekDifficulties,
            durations : settings.filters.durations,
            elevations :  settings.filters.elevations,
            downloads : [
                { value: 1, name: 'nav_trek_map.offline', icon: 'icon_offline.svg' }
            ],
            themes : trekThemes,
            uses: trekUses,
            routes: trekRoute,
            valleys: trekValleys,
            municipalities: trekMunicipalities
        }
    };
}]);
