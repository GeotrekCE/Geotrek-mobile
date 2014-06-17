'use strict';

var geotrekTreks = angular.module('geotrekTreks');

/**
 * Service that gives treks filters
 */

geotrekTreks.value('treksFilters', {
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
    themes : [
        { value: 8, name: 'Lac et glacier', icon: 'deniv1.svg' },
        { value: 8, name: 'Lac et glacier', icon: 'deniv1.svg' },
    ],
    communes : [
        { value: '05064', name: 'La Chapelle-en-Valgaudémar' },
        { value: '05064', name: 'La Chapelle-en-Valgaudémar' },
        { value: '05064', name: 'La Chapelle-en-Valgaudémar' }
    ]
});

