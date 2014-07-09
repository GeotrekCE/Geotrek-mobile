'use strict';

var geotrekLocales = angular.module('geotrekLocales', []);

// App translatable strings (.po/.mo equivalent)
geotrekLocales.constant('locales', {
    'fr': {
        'nav_trek_map.ways': 'Itinéraires',
        'nav_trek_map.map': 'Carte',
        'nav_trek_map.cancel': 'Annuler'
    },
    'en': {
        'nav_trek_map.ways': 'Ways',
        'nav_trek_map.map': 'Map',
        'nav_trek_map.cancel': 'Cancel'            
    }
});

// Locale settings to allow user to change app locale
geotrekLocales.constant('localeSettings',
    [{
        text: 'Français',
        locale: 'fr'
    },
    {
        text: 'English',
        locale: 'en'
    }]
);
